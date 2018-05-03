#!/usr/bin/env node
const path = require('path');
const chalk = require('chalk');
const rimraf = require('rimraf');
const lernaConfig = require('../../lerna.json');
const logger = require('../utils/logger')('task:clean');
const filesToClear = ['lib', '.nyc_output', 'node_modules', 'package-lock.json'];
const rootPath = path.join(__dirname, '../../');

const pathsToClean = lernaConfig.packages
	.reduce((list, packageLocation, i) => {
		return list.concat(filesToClear.map(fileToClear => `${packageLocation}/${fileToClear}`));
	}, [])
	.map(relativePath => path.join(rootPath, relativePath));

logger.log(`Try cleaning ${chalk.magenta(pathsToClean.length)} entries ...`);

try {
	pathsToClean.forEach(pathToClean => {
		rimraf(pathToClean, err => {
			if (err) {
				return logger.error(err);
			}

			logger.success(`Cleaned ${path.relative(rootPath, pathToClean)}`);
		});
	});
} catch (err) {
	logger.error(err);
}
