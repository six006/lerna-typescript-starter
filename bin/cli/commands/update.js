const fs = require('fs');
const path = require('path');
const globby = require('globby');
const rimraf = require('rimraf');
const chproc = require('child_process');
const basePkg = require('../../../package.json');
const createFolder = require('../../utils/createFolder');
const { getLoggableFilePath } = require('../../utils/format');
const logger = require('../../utils/logger')('command:update');

const { COPYFILE_EXCL } = fs.constants;
const ROOT_PATH = path.join(__dirname, '../../../');
const TEMP_UPDATE_LOC = path.join(ROOT_PATH, '.update');
const REMOTE_REPO_PATH = basePkg['lerna-typescript-starter'].repository;

const shallowUpdateFiles = [
	'./bin/**/*.{js,hbs}',
	'./config/typescript/core/**/*',
	'./config/typescript/core/**/*',
	'./test/**/*',
	'./lerna.json',
	'./package.json',
	'./package-lock.json',
].map(localPath => path.join(TEMP_UPDATE_LOC, localPath));

exports = module.exports = commandOptions => {
	const { rootPath } = commandOptions;

	return (preventOverride = false) => {
		return new Promise((resolve, reject) => {
			new Promise((done, failed) => {
				rimraf(TEMP_UPDATE_LOC, err => {
					if (!err) {
						logger.info('removed previous update directory');
						return done();
					}

					logger.error(`could not remove previous update directory: ${err}`);
				});
			}).then(() => {
				createFolder(TEMP_UPDATE_LOC, () => {})
					.then(() => {
						logger.log(`fetching updates from ${REMOTE_REPO_PATH} ...`);

						const cloneTask = chproc.exec(`git clone --depth=1 ${REMOTE_REPO_PATH} ${TEMP_UPDATE_LOC}`);

						cloneTask.on('close', status => {
							if (status !== 0) {
								return logger.error(`could not fetch updates from remote (${status})`);
							}
							logger.success(`temporary cloned updates to ${getLoggableFilePath(TEMP_UPDATE_LOC)}`);

							const updatePaths = globby.sync(shallowUpdateFiles);
							logger.info(`found ${updatePaths.length} files to update, starting ...`);

							updatePaths.map(ressourceUpdatePath => {
								const relativeLogPath = ressourceUpdatePath.replace(TEMP_UPDATE_LOC, '~');
								const moveTask = chproc.exec(
									`mv ${ressourceUpdatePath} ${ressourceUpdatePath.replace(
										TEMP_UPDATE_LOC,
										ROOT_PATH
									)}`
								);

								moveTask.on('close', status => {
									if (status === 0) {
										logger.success(`updated ${relativeLogPath}`);
									} else {
										logger.error(`could not update ${relativeLogPath} (${status})`);
									}
								});

								moveTask.on('error', err => {
									logger.error(`failed updating ${relativeLogPath}: ${err}`);
								});
							});
						});

						cloneTask.on('error', err => {
							logger.error(err);
						});
					})
					.catch(err => {
						logger.error(`failed creating temporary update folder: ${err}`);
					});
			});
		});
	};
};
