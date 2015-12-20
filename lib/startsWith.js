'use strict';

module.exports = (name) => {
  return (task) => {
    return task.displayName.indexOf(name) === 0;
  };
};
