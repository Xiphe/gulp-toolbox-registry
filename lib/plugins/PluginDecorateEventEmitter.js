'use strict';

const EventEmitter = require('async-eventemitter');

module.exports = class PluginDecorateEventEmitter {
  constructor() {
    this.emitter = new EventEmitter();
  }
  decorateHelper(args) {
    const emitter = this.emitter;

    return Object.assign({}, args, {
      helper: Object.assign({}, args.helper, {
        on: emitter.on.bind(emitter),
        once: emitter.once.bind(emitter),
        emit: emitter.emit.bind(emitter),
        removeListener: emitter.removeListener.bind(emitter),
      }),
    });
  }
};
