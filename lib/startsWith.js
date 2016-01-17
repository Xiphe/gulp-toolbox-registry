'use strict';

module.exports = function startsWithFactory(name) {
  return function startsWith(task) {
    return task.displayName.indexOf(name) === 0;
  };
};
