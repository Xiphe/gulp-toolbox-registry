'use strict';

const Uberconfig = require('uberconfig');
const conflictHandler = require('./conflictHandler');
const validations = require('./validations');

module.exports = class PluginUberconfig {
  constructor(config) {
    this.configMap = new WeakMap();
    this.config = new Uberconfig(config);
  }
  validate(toolbox) {
    validations.forEach((validate) => {
      validate(toolbox);
    });
  }
  decorateToolbox(toolbox) {
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
  decorateTaskHelper(opt) {
    opt.taskHelper.getConfig = () => {
      return this.configMap.get(opt.toolbox);
    };

    return opt;
  }
};
