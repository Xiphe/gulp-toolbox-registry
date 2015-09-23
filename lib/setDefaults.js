'use strict';

var path = require('path');
var gutil = require('gulp-util');
var constants = require('./contants');

function setBasePath(config) {
  var basePath;

  try {
    basePath = require('findup').sync(process.cwd(), 'package.json');
  } catch (e) {
    gutil.log(gutil.colors.red(constants.ERROR_NO_PACKAGE_JSON_FOUND));
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
