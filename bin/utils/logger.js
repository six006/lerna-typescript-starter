const chalk = require('chalk');
const figures = require('figures');

class Logger {
	constructor(namespace) {
		this.namespace = namespace;
	}

	format(message, color = 'white', insert) {
		const formattedMessage = insert ? `${message} ${insert}` : message;

		return `[${chalk.grey(this.namespace)}] ${chalk[color](formattedMessage)}`;
	}

	log(message) {
		console.log(this.format(message));
	}

	error(message) {
		console.log(this.format(message, 'red', figures.cross));
	}

	warn(message) {
		console.log(this.format(message, 'yellow', figures.warning));
	}

	info(message) {
		console.log(this.format(message, 'cyan', figures.info));
	}

	success(message) {
		console.log(this.format(message, 'green', figures.tick));
	}
}

exports = module.exports = ns => new Logger(ns);
