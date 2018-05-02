const fs = require('fs');

exports = module.exports = (path, contents) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, contents, { encoding: 'utf8' }, err => {
			if (err) {
				return reject(err);
			}

			resolve(path);
		});
	});
};
