const fs = require('fs');
const hbs = require('handlebars');

exports = module.exports = (opts, data) => {
	const { template, target } = opts;

	return new Promise((resolve, reject) => {
		fs.readFile(template, (err, templateContent) => {
			if (err) {
				return reject(err);
			}

			const template = hbs.compile(templateContent.toString());
			const contents = template(data);

			fs.writeFile(target, contents, { encoding: 'utf8' }, err => {
				if (err) {
					return reject(err);
				}

				resolve();
			});
		});
	});
};
