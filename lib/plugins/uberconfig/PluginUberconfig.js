/* eslint-disable class-methods-use-this */
'use strict';

const conflictHandler = require('./conflictHandler');
const validations = require('./validations');

module.exports = class PluginUberconfig {
  constructor(uberconfig) {
    this.configMap = new WeakMap();
    this.config = uberconfig;
  }
  validate(toolbox) {
    validations.forEach((validation) => {
      validation(toolbox);
    });
  }
  decorateProvider(toolbox) {
    if (!toolbox.config) {
      return toolbox;
    }

    this.configMap.set(
      toolbox,
      this.config.request(
        toolbox.config,
        conflictHandler(toolbox.meta)
      )
    );

    return toolbox;
  }
  decorateHelper(opt) {
    const configMap = this.configMap;

    return Object.assign({}, opt, {
      helper: Object.assign({}, opt.helper, {
        getConfig() {
          return configMap.get(opt.provider);
        },
      }),
    });
  }
};
