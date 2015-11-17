/* eslint global-require: 0 */
'use strict';

var path = require('path');

function setPkg(config) {
  if (!config.pkg) {
    config.pkg = require(path.join(process.cwd(), 'package.json'));
  }
}

module.exports = function setDefaults(config) {
  setPkg(config);
};
