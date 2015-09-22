'use strict';

var path = require('path');
var gutil = require('gulp-util');
var gulpHelp = require('gulp-help');
var _ = require('lodash');
var di = require('di');

function validate(config) {
  if (!config.gulp) {
    throw new Error('Missing local gulp');
  }
}

function amendGulpHelp(config) {
  config.gulp = gulpHelp(config.gulp);
}

function getInjector(config) {
  return new di.Injector([{
    gulp: ['value', config.gulp]
  }]);
}

function setBasePath(config) {
  var basePath;

  try {
    basePath = require('findup').sync(process.cwd(), 'package.json');
  } catch (e) {
    gutil.log(gutil.colors.red('can not find package.json. Aborting.'));
    process.exit(1);
  }

  config.basePath = basePath;
}

function setPkg(config) {
  config.pkg = require(path.join(config.basePath, 'package.json'));
}

function setDefaults(config) {
  setBasePath(config);
  setPkg(config);
}

function getToolboxes(config) {
  var toolboxes = [];

  if (config.pkg.devDependencies) {
    _.forEach(config.pkg.devDependencies, function(version, devDependency) {
      if (devDependency.indexOf('gulp-toolbox-') === 0) {
        toolboxes.push(
          require(
            path.join(config.basePath, 'node_modules', devDependency)
          )
        );
      }
    });
  }

  return toolboxes;
}

module.exports = function(config) {
  validate(config);
  setDefaults(config);
  amendGulpHelp(config);
  var injector = getInjector(config);

  getToolboxes(config).forEach(function(toolbox) {
    injector.invoke(toolbox);
  });
};
