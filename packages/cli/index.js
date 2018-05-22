#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const execa = require('execa');
const vorpal = require('vorpal')();
const runAll = require('npm-run-all');
const pkg = require('../../package.json');
const createFile = require('./utils/createFile');
const logger = require('./utils/logger')('cli');
const lernaConfig = require('../../lerna.json');

// commands
const rootPath = path.join(__dirname, '..', '..');
const createPackage = require('./commands/createPackage');
const updateProject = require('./commands/updateProject');
const detachCLI = require('./commands/detachCLI');
const migrateFromJS = require('./commands/migrateFromJS');

// settings for each cli command
const commandOptions = {
	rootPath,
	settings: pkg['lerna-typescript-starter'] || {},
};

// runner settings for bash
const defaultRunnerOptions = {
	maxParallel: 4,
	printName: true,
};

// command definitions below
vorpal.command('detach', `Remove the CLI from the project`).action((args, callback) => {
	const cliPackagePath = 'packages/cli';
	const basePackagePath = path.join(rootPath, 'package.json');
	const basePackage = require(basePackagePath);

	logger.log(`update project configuration ...`);
	basePackage['lerna-typescript-starter'].ignore.push(cliPackagePath);
	createFile(path.join(rootPath, 'package.json'), JSON.stringify(basePackage));

	logger.log(`removing CLI package from project ...`);
	execa('rm', ['-rf', path.join(rootPath, cliPackagePath)])
		.then(() => {
			logger.success('CLI successfully detached');
		})
		.catch(err => {
			logger.error(`could not detach CLI: ${err}`);
		});
});

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

vorpal.command('migrate', `Migrate JavaScript libraries to a TypeScript package`).action((args, callback) => {
	migrateFromJS(commandOptions)()
		.then(callback)
		.catch(callback);
});

vorpal.command('create-package <name>', 'Create a new package').action((args, callback) => {
	logger.log(`use package name ${chalk.magenta(args.name)}`);
	createPackage(commandOptions)(args.name, 'packages')
		.then(callback)
		.catch(callback);
});

vorpal.command('create-config <name>', ' Create a new configuration').action((args, callback) => {
	createPackage(commandOptions)(args.name, 'config')
		.then(callback)
		.catch(callback);
});

vorpal
	.command('update', 'Updates the base repository structure')
	.option('-s, --save', 'Do not override files, instead clone via renaming to *.update.*')
	.action((args, callback) => {
		updateProject(commandOptions)(Boolean(args.options.save));
	});

// show cli

vorpal.delimiter(`${pkg.name}$`).show();
