'use strict';

const argv = require('../../argv');

module.exports = function skip(name) {
  return (task) => {
    const taskName = task.displayName;
    const tokens = taskName.replace(`${name}:`, '').split(':');

    while (tokens.length > 0) {
      if (argv[`skip-${tokens.join(':')}`]) {
        return false;
      }
      tokens.splice(-1, 1);
    }

    return true;
  };
};
