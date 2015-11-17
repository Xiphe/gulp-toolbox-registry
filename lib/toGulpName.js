'use strict';

const CONSTANTS = require('./contants');

module.exports = function toGulpName(devDependency) {
  return devDependency
    .replace(CONSTANTS.TOOLBOX_PREFIX, '')
    .replace(/-/g, ':');
};
