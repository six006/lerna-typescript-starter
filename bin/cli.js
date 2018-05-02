#!/usr/bin/env node

const vorpal = require('vorpal')();
const runAll = require('npm-run-all');
const pkg = require('../package.json');

// commands
const createPackage = require('./commands/createPackage');

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
	createPackage(args.name, callback);
});

vorpal.delimiter(`${pkg.name}$`).show();
