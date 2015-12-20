'use strict';

const _ = require('lodash');

const rules = [
  (toolbox) => {
    if (!toolbox.meta) {
      return new Error(`toolbox <undefined> does not provide any meta data`);
    }
  },
  (toolbox) => {
    if (!toolbox.meta.name || !_.isString(toolbox.meta.name)) {
      return new Error(`toolbox <undefined> does not provide required "name"` +
        `in it's meta data`);
    }
  },
  (toolbox) => {
    if (!toolbox.meta.description ||
      !_.isString(toolbox.meta.description)
    ) {
      return new Error(`toolbox ${toolbox.meta.name} does not provide ` +
        `required "description" in it's meta data`);
    }
  },
  (toolbox) => {
    if (!toolbox.meta.bugs ||
      !_.isString(toolbox.meta.bugs) &&
      !_.isString(toolbox.meta.bugs.url)
    ) {
      return new Error(`toolbox ${toolbox.meta.name} does not provide ` +
        `required "bugs" url in it's meta data.`);
    }
  }
];

class Validator {
  constructor() {
    this.errors = [];
    this.isValid = this.isValid.bind(this);
  }
  validate() {
    this.errors.forEach((error) => {
      throw error;
    });
  }
  isValid(toolbox) {
    const error = rules.reduce((err, rule) => {
      if (err) {
        return err;
      }

      return rule(toolbox);
    }, null);

    if (error) {
      this.errors.push(error);
      return false;
    }

    return true;
  }
}

Validator.rules = rules;

module.exports = Validator;
