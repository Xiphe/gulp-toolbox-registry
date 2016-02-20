'use strict';

const Uberconfig = require('uberconfig');
const logger = require('gulplog');
const argv = require('minimist')(process.argv.slice(2));

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
    const toolbox = this._getToolboxFromNameMap(args);

    if (!toolbox || !toolbox.config) {
      return args;
    }

    const relatedFiles = this._getRelatedFiles(toolbox.config);

    if (relatedFiles.length) {
      const originTask = args.task;

      args.task = () => {
        const taskWithWaitingLog = this.takerInst.series([
          originTask,
          (done) => {
            logger.info('waiting for changes...');
            done();
          }
        ]);

        taskWithWaitingLog();
        return this.takerInst.watch(
          relatedFiles,
          taskWithWaitingLog
        );
      };
    }

    return args;
  }
  _getToolboxFromNameMap(args) {
    if (!argv.watch ||
      !args.task ||
      args.task.name === 'tempTask'
    ) {
      return false;
    }

    return this.nameMap[args.task.displayName || args.task.name];
  }
  _getRelatedFiles(config) {
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
};
