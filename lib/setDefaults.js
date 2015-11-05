/* eslint no-process-exit: 0, global-require: 0 */

'use strict';

var path = require('path');
var constants = require('./contants');
var logger = require('gulplog');
var chalk = require('chalk');
var findup = require('findup');

function setBasePath(config) {
  var basePath = null;

  try {
    basePath = findup.sync(process.cwd(), 'package.json');
  } catch (err) {
    logger.error(chalk.red(constants.ERROR.NO_PACKAGE_JSON_FOUND));
    process.exit(1);
  }

  config.basePath = basePath;
}

function setPkg(config) {
  config.pkg = require(path.join(config.basePath, 'package.json'));
}

module.exports = function setDefaults(config) {
  setBasePath(config);
  setPkg(config);

  return config;
};
