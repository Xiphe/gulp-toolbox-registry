'use strict';

var argv = require('minimist')(process.argv.slice(2));
var _ = require('lodash');

function _getGroups(tasks) {
  var groups = {};

  _.forEach(tasks, (__, taskName) => {
    var tokens = taskName.split(':');

    while (tokens.length > 1) {
      tokens.splice(-1, 1);
      const GROUP = tokens.join(':');

      if (!groups[GROUP]) {
        groups[GROUP] = [];
      }

      groups[GROUP].push(taskName);
    }
  });

  return groups;
}

function _filterTasks(tasks, groupName) {
  return tasks.filter((taskName) => {
    var tokens = taskName.replace(`${groupName}:`, '').split(':');

    while (tokens.length > 0) {
      if (argv[`skip-${tokens.join(':')}`]) {
        return false;
      }
      tokens.splice(-1, 1);
    }

    return true;
  });
}

function _registerGroupTasks(gulp, tasks, groupName) {
  gulp.task(groupName, (cb) => {
    var filteredTasks = _filterTasks(tasks, groupName);

    if (filteredTasks.length) {
      gulp.parallel(filteredTasks)(cb);
    } else {
      cb();
    }
  });
}

function run(config) {
  _.forEach(
    _getGroups(config.gulp._registry.tasks()),
    (tasks, groupName) => {
      _registerGroupTasks(config.gulp, tasks, groupName);
    }
  );
}

module.exports = {
  _getGroups,
  _filterTasks,
  _registerGroupTasks,
  run
};
