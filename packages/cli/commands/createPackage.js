const path = require('path');
const execa = require('execa');
const Listr = require('listr');
const basePkg = require('../../../package.json');
const createFolder = require('../utils/createFolder');
const copyTemplate = require('../utils/copyTemplate');
const logger = require('../utils/logger')('command:create-package');

const getLogPath = targetPath => targetPath.replace(path.join(__dirname, '../../..'), '~');
const getTemplatePath = packagePath => {
	return path.join(__dirname, `../templates/package/${packagePath}.hbs`);
};

exports = module.exports = commandOptions => {
	const { rootPath } = commandOptions;

	return (packageName, packageBaseLocation = 'packages', opts = {}) => {
		const { supportBrowserEnv } = opts;
		const getPackagePath = name => path.resolve(rootPath, packageBaseLocation, name);

		return new Promise((resolve, reject) => {
			const targetPackagePath = getPackagePath(packageName);
			const configPackagePath = getPackagePath('config');
			const packageSourcePath = path.join(targetPackagePath, 'src');
			const relativeTsSettingsPath = path.relative(targetPackagePath, configPackagePath) + '/..';

			const tasks = new Listr([
				{
					title: `Create new package folder for ${packageName}`,
					task: () => createFolder(targetPackagePath),
				},
				{
					title: 'Initializing contents from boilerplate',
					task: () => {
						return new Listr([
							{
								title: 'Creating package.json',
								task: () =>
									copyTemplate(
										{
											template: getTemplatePath('package'),
											target: path.join(targetPackagePath, 'package.json'),
										},
										{
											supportBrowserEnv: !!supportBrowserEnv,
											project: {
												name: basePkg.name,
											},
											pkg: {
												location: packageBaseLocation,
												name: packageName,
											},
										}
									),
							},
							{
								title: 'Creating TypeScript configuration',
								task: () =>
									copyTemplate(
										{
											template: getTemplatePath('tsconfig'),
											target: path.join(targetPackagePath, 'tsconfig.json'),
										},
										{ relativeTsSettingsPath }
									),
							},
							{
								title: 'Creating compiler configuration',
								task: () =>
									copyTemplate(
										{
											template: getTemplatePath('tsconfig.compiler'),
											target: path.join(targetPackagePath, 'tsconfig.compiler.json'),
										},
										{ relativeTsSettingsPath }
									),
							},
							{
								title: 'Creating source folder',
								task: () => createFolder(packageSourcePath),
							},
							{
								title: 'Creating library index',
								task: () =>
									copyTemplate({
										template: getTemplatePath('src/index'),
										target: path.join(packageSourcePath, '/index.ts'),
									}),
							},
							{
								title: 'Adding support for browser environment',
								enabled: () => !!supportBrowserEnv,
								task: () => {
									return new Listr([
										{
											title: 'Creating test utils folder',
											task: () => createFolder(path.join(packageSourcePath, 'test')),
										},
										{
											title: 'Copying browser environement setup script',
											task: () =>
												copyTemplate({
													template: getTemplatePath('src/test/setupBrowserEnv'),
													target: path.join(packageSourcePath, 'test/setupBrowserEnv.ts'),
												}),
										},
									]);
								},
							},
							{
								title: 'Bootstrapping lerna packages',
								task: (ctx, task) => {
									if (commandOptions.skipBootstrap) {
										return task.skip('Skipping bootstrap process by configuration');
									}

									return execa('npm', ['run', 'bootstrap']);
								},
							},
						]);
					},
				},
			]);

			tasks
				.run()
				.then(resolve)
				.catch(reject);
		});
	};
};
