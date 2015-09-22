'use strict';

var path = require('path');
var gutil = require('gulp-util');
var _ = require('lodash');

function validate(config) {
  if (!config.gulp) {
    throw new Error('Missing local gulp');
  }
}

function loadToolboxes(config) {
  var basePath;

  try {
    basePath = require('findup').sync(process.cwd(), 'package.json');
  } catch (e) {
    gutil.log(gutil.colors.red('can not find package.json. Aborting.'));
    process.exit(1);
  }
  var pkg = require(path.join(basePath, 'package.json'));

  config.basePath = basePath;
  config.pkg = pkg;

  if (pkg.devDependencies) {
    _.forEach(pkg.devDependencies, function(version, devDependency) {
      if (devDependency.indexOf('gulp-toolbox-') === 0) {
        require(
          path.join(basePath, 'node_modules', devDependency)
        )(config);
      }
    });
  }
}

module.exports = function(config) {
  validate(config);

  loadToolboxes(config);
};
