const fs = require('fs');
const handlebars = require('handlebars');

exports = module.exports = (opts, data) => {
	const { template, target } = opts;

	return new Promise((resolve, reject) => {
		fs.readFile(template, (err, templateContent) => {
			if (err) {
				return reject(err);
			}

			const template = handlebars.compile(templateContent.toString());
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
