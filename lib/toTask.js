'use strict';

var toTaskName = require('./toTaskName');

module.exports = (undertaker) => {
  return (toolbox) => {
    const taskName = toTaskName(toolbox.meta.name);
    const task = toolbox.getTask(undertaker);

    task.displayName = taskName;
    task.description = toolbox.meta.description;

    return task;
  };
};
