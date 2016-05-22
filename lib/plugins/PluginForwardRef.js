'use strict';

const IS_FORWARD_REF = Symbol('IS_FORWARD_REF');

module.exports = class PluginForwardRef {
  init(store) {
    this.registry = store.takerInst.registry();
  }
  get(args) {
    if (!args.name) {
      return args;
    }

    const registry = this.registry;

    if (args.task || args.arguments[1] === IS_FORWARD_REF) {
      return args;
    }

    function tempTask(done) {
      const task = registry.get(args.name, IS_FORWARD_REF);

      if (!task) {
        throw new Error(`task '${args.name}' not defined before use`);
      }

      return task(done);
    }

    tempTask.displayName = `${args.name}`;

    return Object.assign({}, args, {
      task: tempTask,
    });
  }
};
