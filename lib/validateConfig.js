module.exports = function validate(config) {
  'use strict';

  if (!config.gulp) {
    throw new Error('Missing local gulp');
  }
};
