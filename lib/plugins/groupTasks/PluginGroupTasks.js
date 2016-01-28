'use strict';

const startsWith = require('./startsWith');
const skip = require('./skip');
const group = require('./group');

module.exports = class PluginGroupTasks {
  init(args) {
    this.store = args.store;
    this.takerInst = args.takerInst;
  }
  get(args) {
    if (args.task) {
      return args;
    }

    const task = this.store.tasks
      .filter(startsWith(args.name))
      .filter(skip(args.name))
      .reduce(group(this.takerInst), null);

    if (task) {
      args.task = task;
    }

    return args;
  }
};
