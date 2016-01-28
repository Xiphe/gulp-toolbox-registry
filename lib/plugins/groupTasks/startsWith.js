'use strict';

module.exports = function startsWithFactory(name) {
  return function startsWith(task) {
    return (task.displayName || task.name).indexOf(name) === 0;
  };
};
