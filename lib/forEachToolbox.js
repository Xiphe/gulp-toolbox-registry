/* eslint global-require: 0 */

'use strict';

const TOOLBOX_INDICATOR = 'gulp-toolbox-';

var path = require('path');
var _ = require('lodash');

module.exports = function forEachToolbox(config, cb) {
  if (config.toolboxes) {
    _.forEach(config.toolboxes, cb);
    return;
  }

  if (!config.pkg.devDependencies) {
    return;
  }

  _.forEach(config.pkg.devDependencies, (__, devDependency) => {
    if (devDependency.startsWith(TOOLBOX_INDICATOR)) {
      const TOOLBOX_NAME = devDependency
        .replace(TOOLBOX_INDICATOR, '')
        .replace(/-/g, ':');

      cb(TOOLBOX_NAME, require(path.join(
        config.basePath,
        'node_modules',
        devDependency
      )));
    }
  });
};
