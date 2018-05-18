const path = require('path');
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

	return (packageName, commandFinished, packageBaseLocation = 'packages') => {
		const getPackagePath = name => path.resolve(rootPath, packageBaseLocation, name);

		return new Promise((resolve, reject) => {
			const targetPackagePath = getPackagePath(packageName);
			const configPackagePath = getPackagePath('config');
			const relativeTsSettingsPath = path.relative(targetPackagePath, configPackagePath) + '/..';

			logger.info(`creating package under ${getLogPath(targetPackagePath)}`);

			createFolder(targetPackagePath)
				.then(() => {
					copyTemplate(
						{ template: getTemplatePath('package'), target: path.join(targetPackagePath, 'package.json') },
						{
							project: {
								name: basePkg.name,
							},
							pkg: {
								location: packageBaseLocation,
								name: packageName,
							},
						}
					)
						.then(() => logger.success('package.json created'))
						.catch(e => {
							logger.error(e);
						});
				})
				.then(() => {
					copyTemplate(
						{
							template: getTemplatePath('tsconfig'),
							target: path.join(targetPackagePath, 'tsconfig.json'),
						},
						{ relativeTsSettingsPath }
					)
						.then(() => logger.success('tsconfig.json created'))
						.catch(e => {
							logger.error(e);
						});
				})
				.then(() => {
					copyTemplate(
						{
							template: getTemplatePath('tsconfig.build'),
							target: path.join(targetPackagePath, 'tsconfig.build.json'),
						},
						{ relativeTsSettingsPath }
					)
						.then(() => logger.success('tsconfig.build.json created'))
						.catch(e => {
							logger.error(e);
						});
				})
				.then(() => {
					const packageSourcePath = path.join(targetPackagePath, 'src');

					createFolder(packageSourcePath)
						.then(() => {
							copyTemplate({
								template: getTemplatePath('src/index'),
								target: path.join(packageSourcePath, '/index.ts'),
							})
								.then(() => {
									logger.success('src/index.ts created');
									commandFinished();
								})
								.catch(e => {
									logger.error(e);
								});
						})
						.catch(e => {
							logger.error(e);
						});
				})
				.catch(e => logger.error(e));
		});
	};
};
