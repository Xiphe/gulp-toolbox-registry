'use strict';

module.exports = {
  validate(toolbox) {
    if (!toolbox.meta ||
      !toolbox.meta.description ||
      typeof toolbox.meta.description !== 'string'
    ) {
      throw new Error(`toolbox ${toolbox.meta.name} is missing ` +
        'required "description" in it\'s meta data');
    }
  },
  decorateTask(task) {
    const newTask = task;

    newTask.description = task.provider.meta.description;

    return newTask;
  },
};
