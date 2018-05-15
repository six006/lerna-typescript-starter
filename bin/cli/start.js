#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const vorpal = require('vorpal')();
const runAll = require('npm-run-all');
const pkg = require('../../package.json');
const logger = require('../utils/logger')('cli');
const lernaConfig = require('../../lerna.json');

// commands
const rootPath = path.join(__dirname, '..', '..');
const createPackage = require('./commands/createPackage');

// settings for each cli command
const commandOptions = {
	rootPath,
};

// runner settings for bash
const defaultRunnerOptions = {
	maxParallel: 4,
	printName: true,
};

// command definitions below

vorpal.command('test', `Run tests for ${pkg.name}`).action((args, callback) => {
	logger.info(`preparing test run in ${chalk.magenta(lernaConfig.packages.join(', '))}`);
	runAll(['test'], defaultRunnerOptions)
		.then(() => {
			logger.success('tests processed');
			callback();
		})
		.catch(err => {
			logger.error('some tests failed');
			callback(err);
		});
});

vorpal.command('build', `Build all packages in ${pkg.name}`).action((args, callback) => {
	runAll(['build'], defaultRunnerOptions)
		.then(() => {
			logger.success('building packages succeeded');
			callback();
		})
		.catch(() => {
			logger.error('building packages failed');
			callback(err);
		});
});

vorpal.command('create-package <name>', 'Create a new package').action((args, callback) => {
	logger.log(`use package name ${chalk.magenta(args.name)}`);
	createPackage(commandOptions)(args.name, callback, 'packages');
});

vorpal.command('create-config <name>', ' Create a new configuration').action((args, callback) => {
	createPackage(commandOptions)(args.name, callback, 'config');
});

// show cli

vorpal.delimiter(`${pkg.name}$`).show();
