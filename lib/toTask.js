'use strict';

const toTaskName = require('./toTaskName');

module.exports = (store) => {
  const gulp = store.gulp;

  return (toolbox) => {
    const taskName = toTaskName(toolbox.meta.name);
    const task = toolbox.getTask(gulp);

    task.displayName = taskName;
    task.description = toolbox.meta.description;
    store.getRelatedFiles[task.displayName] = () => {
      if (task.nowatch || !toolbox._originalConfig) {
        return [];
      }

      return Object.keys(toolbox._originalConfig).filter((key) => {
        return /^files\./.test(key);
      }).map((key) => {
        return store.config.get(
          key,
          toolbox._originalConfig[key].default
        );
      }).reduce((list, files) => {
        if (!files.length) {
          return list;
        }

        return list.concat(files);
      }, []).filter((entry) => {
        return entry && entry.length;
      });
    };

    return task;
  };
};
