'use strict';

var _ = require('lodash');
var validateMetaData = require('./validateMetaData');

module.exports = function initToolboxes(toolboxes, configurator) {
  var tasks = {};

  _.forEach(toolboxes, (data, toolboxName) => {
    validateMetaData(data.meta, toolboxName);

    tasks[toolboxName] = data.toolbox(
      configurator.requestFor(toolboxName, data.meta)
    );
  });

  return tasks;
};
