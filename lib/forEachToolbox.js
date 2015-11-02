'use strict';

const TOOLBOX_INDICATOR = 'gulp-toolbox-';

var path = require('path');
var _ = require('lodash');

module.exports = function forEachToolbox(config, cb) {
  if (!config.pkg.devDependencies) {
    return;
  }

  _.forEach(config.pkg.devDependencies, (version, devDependency) => {
    if (devDependency.startsWith(TOOLBOX_INDICATOR)) {
      let toolboxName = devDependency
        .replace(TOOLBOX_INDICATOR, '')
        .replace(/-/g, ':');

      cb(toolboxName, require(path.join(
        config.basePath,
        'node_modules',
        devDependency
      )));
    }
  });
};
