/* eslint max-params: [2, 4] */
'use strict';

var CONSTANTS = require('./contants');

module.exports = (name, allowFwd, getTask, originTask) => {
  if (allowFwd === false || originTask) {
    return originTask;
  }

  const tempTask = (done) => {
    const task = getTask(name, false);

    if (!task) {
      if (name.indexOf(CONSTANTS.OPTIONAL_PREFIX) === 0) {
        return done();
      }

      throw new Error(`task '${name}' not defined before use`);
    }

    return task(done);
  };

  tempTask.displayName = `${name}`;

  return tempTask;
};
