'use strict';

function toTaskName(name) {
  return name
    .replace('gulp-toolbox-', '')
    .replace(/-/g, ':');
}

module.exports = {
  validate(toolbox) {
    if (!toolbox.meta ||
      !toolbox.meta.name ||
      typeof toolbox.meta.name !== 'string'
    ) {
      throw new Error('toolbox <undefined> does not provide required "name"' +
        'in it\'s meta data');
    }
  },
  decorateTask(task) {
    const newTask = task;

    newTask.displayName = toTaskName(task.provider.meta.name);

    return newTask;
  },
};
