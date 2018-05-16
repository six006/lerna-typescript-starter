const path = require('path');

exports.getLoggableFilePath = targetPath => targetPath.replace(path.join(__dirname, '..'), '~');
