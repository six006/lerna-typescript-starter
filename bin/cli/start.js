#!/usr/bin/env node

const path = require('path');
const vorpal = require('vorpal')();
const runAll = require('npm-run-all');
const pkg = require('../package.json');
const rootPath = path.join(__dirname, '..');
const createPackage = require('./commands/createPackage');

const commandOptions = {
	rootPath,
};

const defaultRunnerOptions = {
	maxParallel: 4,
	printName: true,
};

vorpal.command('test', `Run tests for ${pkg.name}`).action((args, callback) => {
	runAll(['test'], defaultRunnerOptions)
		.then(() => {
			callback();
		})
		.catch(err => {
			callback(err);
		});
});

vorpal.command('create-package <name>', 'Create a new package').action((args, callback) => {
	createPackage(commandOptions)(args.name, callback, 'packages');
});

vorpal.command('create-config <name>', ' Create a new configuration').action((args, callback) => {
	createPackage(commandOptions)(args.name, callback, 'config');
});

vorpal.delimiter(`${pkg.name}$`).show();
