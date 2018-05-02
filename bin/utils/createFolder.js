const fs = require('fs');

exports = module.exports = (path, done) => {
	return new Promise((resolve, reject) => {
		fs.mkdir(path, err => {
			if (!err || (err && err.code === 'EEXIST')) {
				return resolve(path);
			}

			reject(err);
		});
	});
};
