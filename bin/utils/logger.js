const chalk = require('chalk');
const figures = require('figures');

class Logger {
	constructor(namespace) {
		this.namespace = namespace;
	}

	format(level, message, color = 'white', insert) {
		const colorize = chalk[color];
		insert = insert || '>';

		return ` ${colorize(insert)} ${colorize(message)} ${chalk.grey(`[${this.namespace}]`)}`;
	}

	log(message) {
		console.log(this.format('log', message, 'white', figures.pointerSmall));
	}

	error(message) {
		console.log(this.format('error', message, 'red', figures.cross));
	}

	warn(message) {
		console.log(this.format('warning', message, 'yellow', figures.warning));
	}

	info(message) {
		console.log(this.format('info', message, 'cyan', figures.info));
	}

	success(message) {
		console.log(this.format('success', message, 'green', figures.tick));
	}
}

exports = module.exports = ns => new Logger(ns);
