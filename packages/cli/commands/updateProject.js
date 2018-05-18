const fs = require('fs');
const path = require('path');
const Listr = require('listr');
const execa = require('execa');
const globby = require('globby');
const rimraf = require('rimraf');
const chproc = require('child_process');
const basePkg = require('../../../package.json');
const createFolder = require('../utils/createFolder');
const { getLoggableFilePath } = require('../utils/format');
const logger = require('../utils/logger')('command:update');

const { COPYFILE_EXCL } = fs.constants;
const ROOT_PATH = path.join(__dirname, '../../../');
const TEMP_UPDATE_LOC = path.join(ROOT_PATH, '.update');
const REMOTE_REPO_PATH = basePkg['lerna-typescript-starter'].repository;

const shallowUpdateFiles = [
	'./packages/cli/**/*.{js,hbs}',
	'./config/typescript/core/**/*',
	'./config/typescript/core/**/*',
	'./test/**/*',
].map(localPath => path.join(TEMP_UPDATE_LOC, localPath));

const dependencyUpdateFiles = ['./package.json', './packages/cli/package.json'].map(localPath =>
	path.join(TEMP_UPDATE_LOC, localPath)
);

exports = module.exports = commandOptions => {
	const { rootPath } = commandOptions;

	return (preventOverride = false) => {
		const tasks = new Listr([
			{
				title: 'Prepare',
				task: () => {
					return new Listr([
						{
							title: 'clean update directory',
							task: () => {
								return new Promise((resolve, reject) => {
									rimraf(TEMP_UPDATE_LOC, err => {
										if (!err) {
											return resolve();
										}

										reject();
									});
								});
							},
						},
						{
							title: 'rebuilding update structure',
							task: () => createFolder(TEMP_UPDATE_LOC),
						},
					]);
				},
			},
			{
				title: 'Fetch latest update from remote',
				task: () => execa('git', ['clone', '--depth=1', REMOTE_REPO_PATH, TEMP_UPDATE_LOC]),
			},
			{
				title: 'Shallow update',
				task: () => {
					return new Listr([
						{
							title: 'find possible updates',
							task: (ctx, task) => {
								ctx.paths = {
									shallowUpdate: [],
									dependencyUpdate: [],
								};

								try {
									ctx.paths.shallowUpdate = globby.sync(shallowUpdateFiles);
								} catch (err) {
									task.skip(err.message);
								}
							},
						},
						{
							title: 'copy core updates',
							task: (ctx, task) => {
								return Promise.all(
									ctx.paths.shallowUpdate.map(shallowUpdatePath => {
										return execa('mv', [
											ressourceUpdatePath,
											ressourceUpdatePath.replace(TEMP_UPDATE_LOC, ROOT_PATH),
										]);
									})
								);
							},
						},
					]);
				},
			},
			{
				title: 'Dependency updates',
				task: () => {
					const newPackagePaths = globby.sync(dependencyUpdateFiles);
					const updateTasks = newPackagePaths.map(packagePath => {
						let targetPath = packagePath.replace(TEMP_UPDATE_LOC, ROOT_PATH);
						targetPath += '.update';

						return {
							title: `migrate ${packagePath}`,
							task: () => execa('mv', packagePath, targetPath),
						};
					});

					return new Listr(updateTasks);
				},
			},
		]);

		return tasks.run();
	};
};
