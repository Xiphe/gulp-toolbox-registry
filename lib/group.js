/* eslint max-params: [2, 4] */
'use strict';

module.exports = (undertaker) => {
  return (group, task, index, tasks) => {
    const collection = group || [];

    if (!group && task && !tasks[index + 1]) {
      return task;
    }

    collection.push(task);

    if (!tasks[index + 1]) {
      return undertaker.parallel(collection);
    }

    return collection;
  };
};
