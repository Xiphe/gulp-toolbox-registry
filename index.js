'use strict';

var path = require('path');
var _ = require('lodash');
var di = require('di');
var validateConfig = require('./lib/validateConfig');
var setDefaults = require('./lib/setDefaults');
var groupie = require('./lib/groupie');

function getInjector(config) {
  return new di.Injector([{
    gulp: ['value', config.gulp]
  }]);
}

function getToolboxes(config) {
  var toolboxes = [];

  if (config.pkg.devDependencies) {
    _.forEach(config.pkg.devDependencies, (version, devDependency) => {
      if (devDependency.startsWith('gulp-toolbox-')) {
        toolboxes.push(require(path.join(
          config.basePath,
          'node_modules',
          devDependency
        )));
      }
    });
  }

  return toolboxes;
}

module.exports = function(config) {
  validateConfig(config);
  setDefaults(config);
  var injector = getInjector(config);

  getToolboxes(config).forEach(toolbox => injector.invoke(toolbox));
  groupie.run(config);
};
