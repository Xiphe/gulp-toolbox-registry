'use strict';

var path = require('path');
var constants = require('./contants');
var logger = require('gulplog');
var chalk = require('chalk');

function setBasePath(config) {
  var basePath;

  try {
    basePath = require('findup').sync(process.cwd(), 'package.json');
  } catch (e) {
    logger.error(chalk.red(constants.ERROR_NO_PACKAGE_JSON_FOUND));
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
