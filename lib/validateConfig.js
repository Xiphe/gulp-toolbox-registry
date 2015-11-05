'use strict';

module.exports = function validate(config) {
  if (!config.gulp) {
    throw new Error('Missing local gulp');
  }
};
