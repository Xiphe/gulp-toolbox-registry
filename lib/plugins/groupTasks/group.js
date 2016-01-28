/* eslint max-params: [2, 4] */
'use strict';

module.exports = (takerInst) => {
  return (group, task, index, tasks) => {
    const collection = group || [];

    if (!group && task && !tasks[index + 1]) {
      return task;
    }

    collection.push(takerInst.task(
      task.displayName || task.name
    ));

    if (!tasks[index + 1]) {
      return takerInst.parallel(collection);
    }

    return collection;
  };
};
