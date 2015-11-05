'use strict';

var di = require('di');
var validateConfig = require('./lib/validateConfig');
var setDefaults = require('./lib/setDefaults');
var groupie = require('./lib/groupie');
var forEachToolbox = require('./lib/forEachToolbox');

function getInjector(config) {
  return new di.Injector([{
    gulp: ['value', config.gulp]
  }]);
}

module.exports = function initGulpToolbox(config) {
  var injector = null;

  validateConfig(config);
  setDefaults(config);
  injector = getInjector(config);

  forEachToolbox(config, (toolboxName, taskFactory) => {
    config.gulp.task(
      toolboxName,
      injector.invoke(taskFactory)
    );
  });

  groupie.run(config);
};
