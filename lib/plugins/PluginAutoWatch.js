'use strict';

const Uberconfig = require('uberconfig');
const logger = require('gulplog');
const argv = require('../argv');

function getToolboxFromNameMap(args, nameMap) {
  if (!argv.watch ||
    !args.task ||
    args.task.name === 'tempTask'
  ) {
    return false;
  }

  return nameMap[args.task.displayName || args.task.name];
}

function getRelatedFiles(config) {
  return Object.keys(config).reduce((files, key) => {
    if (key.indexOf('files.') === 0) {
      return files.concat(this.config.get(
        key,
        config[key].default
      ));
    }

    return files;
  }, []);
}

module.exports = class PluginAutoWatch {
  constructor(config) {
    this.config = new Uberconfig(config);
    this.nameMap = {};
  }
  init(store) {
    this.takerInst = store.takerInst;
  }
  decorateTask(task) {
    this.nameMap[task.displayName || task.name] = task.provider;

    return task;
  }
  get(args) {
    const toolbox = getToolboxFromNameMap(args, this.nameMap);

    if (!toolbox || !toolbox.config) {
      return args;
    }

    const relatedFiles = getRelatedFiles(toolbox.config);

    if (relatedFiles.length) {
      const originTask = args.task;
      const takerInst = this.takerInst;

      return Object.assign({}, args, {
        task() {
          const taskWithWaitingLog = takerInst.series([
            originTask,
            (done) => {
              logger.info('waiting for changes...');
              done();
            },
          ]);

          taskWithWaitingLog();
          return takerInst.watch(
            relatedFiles,
            taskWithWaitingLog
          );
        },
      });
    }

    return args;
  }
};
