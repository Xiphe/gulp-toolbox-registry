'use strict';

module.exports = class PluginDecorateSrc {
  init(store) {
    this.takerInst = store.takerInst;
  }
  decorateHelper(args) {
    return Object.assign({}, args, {
      helper: Object.assign({}, args.helper, {
        src: this.takerInst.src,
      }),
    });
  }
};
