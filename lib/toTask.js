'use strict';

var toTaskName = require('./toTaskName');

module.exports = (gulp) => {
  return (toolbox) => {
    const taskName = toTaskName(toolbox.meta.name);
    const task = toolbox.getTask(gulp);

    task.displayName = taskName;
    task.description = toolbox.meta.description;

    return task;
  };
};
