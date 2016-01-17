/* eslint max-params: [2, 4] */
'use strict';

module.exports = (gulp) => {
  return (group, task, index, tasks) => {
    const collection = group || [];

    if (!group && task && !tasks[index + 1]) {
      return task;
    }

    collection.push(task);

    if (!tasks[index + 1]) {
      return gulp.parallel(collection);
    }

    return collection;
  };
};
