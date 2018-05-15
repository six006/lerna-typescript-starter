const path = require('path');
const basePkg = require('../../package.json');
const createFolder = require('../utils/createFolder');
const copyTemplate = require('../utils/copyTemplate');
const logger = require('../utils/logger')('create-package');

const getLogPath = targetPath => targetPath.replace(path.join(__dirname, '../..'), '~');
const getTemplatePath = packagePath => {
	return path.join(__dirname, `../templates/package/${packagePath}.hbs`);
};

// templates
// const index = require('../templates/index.js.json');
// const pkg = require('../templates/package.json');
// const tsconfig = require('../templates/tsconfig.json');
// const tsconfigBuild = require('../templates/tsconfig.build.json');

const getPackagePath = name => path.resolve(__dirname, '../../packages/', name);

exports = module.exports = (packageName, commandFinished) => {
	return new Promise((resolve, reject) => {
		const name = `@${basePkg.name}/${packageName}`;
		const targetPackagePath = getPackagePath(packageName);

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
							scope: basePkg.name,
							name,
						},
					}
				)
					.then(() => logger.success('package.json created'))
					.catch(e => {
						logger.error(e);
					});
			})
			.then(() => {
				copyTemplate({
					template: getTemplatePath('tsconfig'),
					target: path.join(targetPackagePath, 'tsconfig.json'),
				})
					.then(() => logger.success('tsconfig.json created'))
					.catch(e => {
						logger.error(e);
					});
			})
			.then(() => {
				copyTemplate({
					template: getTemplatePath('tsconfig.build'),
					target: path.join(targetPackagePath, 'tsconfig.build.json'),
				})
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
							target: path.join(packageSourcePath, '/index.js'),
						})
							.then(() => {
								logger.success('src/index.js created');
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
