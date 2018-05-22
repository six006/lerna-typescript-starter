const path = require('path');
const execa = require('execa');
const Listr = require('listr');
const globby = require('globby');
const inquirer = require('inquirer');
const copyFile = require('cp-file');
const wait = require('../utils/wait');
const createPackage = require('./createPackage');

const PROCESS_DIR = process.cwd();
const ROOT_DIR = path.join(__dirname, '../../../');
const DEFAULT_MIGRATION_DIR = 'migration';

const valueOrListToList = value => (Array.isArray(value) ? value : [value]);

exports = module.exports = commandOptions => {
	const settings = commandOptions.settings || {};
	const migrationSettings = settings.migrations || {};
	const createNewPackage = createPackage(
		Object.assign(commandOptions, {
			skipBootstrap: true,
		})
	);

	return () => {
		return new Promise((resolve, reject) => {
			const migrationsDirectory = migrationSettings.config || DEFAULT_MIGRATION_DIR;
			const absPathMigrationsDir = path.join(ROOT_DIR, migrationsDirectory);
			const migrationFiles = globby.sync(path.join(absPathMigrationsDir, '**/*.json'));
			const readableMigrationFiles = migrationFiles.map(name => name.replace(absPathMigrationsDir, ''));

			inquirer
				.prompt([
					{
						type: 'list',
						name: 'migration',
						message: 'Select a migration configuration file',
						choices: readableMigrationFiles,
					},
					{
						type: 'confirm',
						name: 'supportBrowserEnv',
						message: 'Does the package use the browser environment?',
						default: false,
					},
				])
				.then(answers => {
					const tasks = new Listr([
						{
							title: `Reading migration configurations from ${migrationsDirectory}`,
							task: (ctx, task) => {
								return new Promise((resolve, reject) => {
									try {
										ctx.config = require(path.join(absPathMigrationsDir, answers.migration));
										resolve();
									} catch (err) {
										reject(err);
										task.skip(err.message);
									}
								});
							},
						},
						{
							title: 'Creating new package for content',
							task: ctx =>
								createNewPackage(ctx.config.target, 'packages', {
									supportBrowserEnv: answers.supportBrowserEnv,
								}),
						},
						{
							title: 'Fetch files to migrate',
							task: ctx => {
								const sourcePackagePath = ctx.config.source;

								ctx.config.pattern = ctx.config.pattern || [];
								ctx.config.ignore = ctx.config.ignore || [];

								const patterns = valueOrListToList(ctx.config.pattern).map(pattern =>
									path.join(sourcePackagePath, pattern)
								);
								const ignores = valueOrListToList(ctx.config.ignore).map(
									pattern => '!' + path.join(sourcePackagePath, pattern)
								);

								ctx.migration = {
									sourcePackagePath,
									filePathsToMigrate: globby.sync(patterns.concat(ignores)),
								};
							},
						},
						{
							title: 'Preparing new files to copy',
							task: ctx => {
								const { filePathsToMigrate, sourcePackagePath } = ctx.migration;

								const filePathsRenamed = filePathsToMigrate;

								ctx.migration.copyConfiguration = filePathsRenamed
									.map(filePath => ({
										transforms: [], // prepare for further impl.
										source: filePath,
										target: path.join(
											ROOT_DIR,
											migrationSettings.packages,
											ctx.config.target,
											'src', // important for .ts files
											filePath.replace(sourcePackagePath, '')
										),
									}))
									.map(fileConfig => {
										const ext = path.extname(fileConfig.target);

										if (ext === '.js') {
											return Object.assign({}, fileConfig, {
												target:
													ext === '.js'
														? `${fileConfig.target.slice(0, -3)}.ts`
														: fileConfig.target,
											});
										}

										return fileConfig;
									});
							},
						},
						{
							title: 'Copying files to target directory',
							task: ctx => {
								const { copyConfiguration } = ctx.migration;
								const copyTasks = copyConfiguration.map(copyConfig =>
									copyFile(copyConfig.source, copyConfig.target)
								);

								return Promise.all([wait(1000)].concat(copyTasks));
							},
						},
						{
							title: 'Bootstrapping lerna packages',
							task: () => execa('npm', ['run', 'bootstrap']),
						},
					]);

					return tasks.run();
				});
		});
	};
};
