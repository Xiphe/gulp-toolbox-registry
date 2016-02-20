'use strict';

module.exports = class PluginDecorateSrc {
  init(store) {
    this.takerInst = store.takerInst;
  }
  decorateHelper(args) {
    args.helper.src = this.takerInst.src;

    return args;
  }
};
