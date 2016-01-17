'use strict';

const _ = require('lodash');

const rules = [
  (toolbox) => {
    if (!toolbox.meta) {
      throw new Error(`toolbox <undefined> does not provide any meta data`);
    }
  },
  (toolbox) => {
    if (!toolbox.meta.name || !_.isString(toolbox.meta.name)) {
      throw new Error(`toolbox <undefined> does not provide required "name"` +
        `in it's meta data`);
    }
  },
  (toolbox) => {
    if (!toolbox.meta.description ||
      !_.isString(toolbox.meta.description)
    ) {
      throw new Error(`toolbox ${toolbox.meta.name} does not provide ` +
        `required "description" in it's meta data`);
    }
  },
  (toolbox) => {
    if (!toolbox.meta.bugs ||
      !_.isString(toolbox.meta.bugs) &&
      !_.isString(toolbox.meta.bugs.url)
    ) {
      throw new Error(`toolbox ${toolbox.meta.name} does not provide ` +
        `required "bugs" url in it's meta data.`);
    }
  }
];

module.exports = function validate(toolbox) {
  rules.forEach((rule) => {rule(toolbox);});

  return true;
};
