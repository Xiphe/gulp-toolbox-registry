'use strict';

const IS_FOREWARD_REF = Symbol('IS_FOREWARD_REF');

module.exports = class PluginForewardRef {
  init(store) {
    this.registry = store.takerInst.registry();
  }
  get(args) {
    if (!args.name) {
      return args;
    }

    const registry = this.registry;

    if (args.task || args.arguments[1] === IS_FOREWARD_REF) {
      return args;
    }

    function tempTask(done) {
      const task = registry.get(args.name, IS_FOREWARD_REF);

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
