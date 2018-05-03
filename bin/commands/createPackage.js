const path = require('path');
const basePkg = require('../../package.json');
const createFile = require('../utils/createFile');
const createFolder = require('../utils/createFolder');
const logger = require('../utils/logger')('create-package');

// templates
const index = require('../templates/index.js.json');
const pkg = require('../templates/package.json');
const tsconfig = require('../templates/tsconfig.json');
const tsconfigBuild = require('../templates/tsconfig.build.json');

exports = module.exports = (packageName, commandFinished, packageBaseLocation = 'packages') => {
	const getPackagePath = name => path.resolve0(__dirname, `../../${packageBaseLocation}/`, name);
	return new Promise((resolve, reject) => {
		const name = `@${basePkg.name}/${name}`;
		const targetPackagePath = getPackagePath(name);

		console.log('creating package under', targetPackagePath);

		createFolder(targetPackagePath)
			.then(() => {
				pkg.name = name;
				createFile(path.join(targetPackagePath, 'package.json'), JSON.stringify(pkg, null, 2))
					.then(() => logger.success('package.json created'))
					.catch(e => {
						logger.error(e);
					});
			})
			.then(() => {
				createFile(path.join(targetPackagePath, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2))
					.then(() => logger.success('tsconfig.json created'))
					.catch(e => {
						logger.error(e);
					});
			})
			.then(() => {
				createFile(path.join(targetPackagePath, 'tsconfig.build.json'), JSON.stringify(tsconfigBuild, null, 2))
					.then(() => logger.success('tsconfig.build.json created'))
					.catch(e => {
						logger.error(e);
					});
			})
			.then(() => {
				const packageSourcePath = path.join(targetPackagePath, 'src');
				createFolder(packageSourcePath)
					.then(() => {
						createFile(path.join(packageSourcePath, 'index.js'), index.contents)
							.then(() => {
								logger.success('index.js created');
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
