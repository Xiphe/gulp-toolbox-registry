'use strict';

const EventEmitter = require('events');

module.exports = class PluginDecorateEventEmitter {
  constructor() {
    this.emitter = new EventEmitter();
  }
  decorateHelper(args) {
    const emitter = this.emitter;

    Object.assign(
      args.helper,
      {
        on: emitter.on.bind(emitter),
        once: emitter.once.bind(emitter),
        emit: emitter.emit.bind(emitter),
        removeListener: emitter.removeListener.bind(emitter)
      }
    );

    return args;
  }
};
