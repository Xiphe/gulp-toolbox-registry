'use strict';

var _ = require('lodash');
var assert = require('assert');

module.exports = function validateMetaData(metaData, toolboxName) {
  assert.ok(
    metaData.bugs &&
    (_.isString(metaData.bugs) ||
    _.isString(metaData.bugs.url)),
    `toolbox ${toolboxName} does not provide required "bugs" url in ` +
    `it's meta data.`
  );
};
