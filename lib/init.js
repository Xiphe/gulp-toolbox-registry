'use strict';

var setDefaults = require('./setDefaults');
var getToolboxes = require('./getToolboxes');
var initToolboxes = require('./initToolboxes');
var Configurator = require('./Configurator');
var groupTasks = require('./groupTasks');
var validateConfig = require('./validateConfig');
var _ = require('lodash');

module.exports = function initGulpToolboxes(config) {
  var configurator = null;
  var gulpTasks = null;

  validateConfig(config);
  setDefaults(config);

  configurator = new Configurator(config);

  gulpTasks = initToolboxes(
    getToolboxes(config),
    configurator
  );

  configurator.validate();

  _.forEach(gulpTasks, (task, name) => {
    config.gulp.task(name, task);
  });

  groupTasks.create(config);
};
