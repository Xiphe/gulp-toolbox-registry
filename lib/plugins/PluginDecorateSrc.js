'use strict';

module.exports = class PluginDecorateSrc {
  init(args) {
    this.takerInst = args.takerInst;
  }
  decorateTaskHelper(args) {
    args.taskHelper.src = this.takerInst.src;

    return args;
  }
};
