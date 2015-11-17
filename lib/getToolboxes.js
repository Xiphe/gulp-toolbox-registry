/* eslint global-require: 0 */
'use strict';

var _ = require('lodash');
var path = require('path');
var toGulpName = require('./toGulpName');
const CONSTANTS = require('./contants');

module.exports = function getToolboxes(config) {
  var returns = {};

  if (config.toolboxes) {
    _.forEach(config.toolboxes, (data, toolboxName) => {
      returns[toolboxName] = {
        toolbox: data.toolbox || data,
        meta: data.meta || data
      };
    });
  } else {
    _.forEach(config.pkg.devDependencies, (__, devDependency) => {
      if (devDependency.startsWith(CONSTANTS.TOOLBOX_PREFIX)) {
        let toolboxPath = null;
        const TOOLBOX_NAME = toGulpName(devDependency);

        toolboxPath = path.join(
          process.cwd(),
          'node_modules',
          devDependency
        );

        returns[TOOLBOX_NAME] = {
          toolbox: require(toolboxPath),
          meta: require(path.join(toolboxPath, 'package.json'))
        };
      }
    });
  }

  return returns;
};
