'use strict';

const DefaultRegistry = require('undertaker-registry');
const minimist = require('minimist');
const validate = require('./validate');
const toTask = require('./toTask');
const startsWith = require('./startsWith');
const group = require('./group');
const skip = require('./skip');
const provideFwdRef = require('./provideFwdRef');
const conflictHandler = require('./conflictHandler');
const Uberconfig = require('uberconfig');
const watch = require('./watch');
const querystring = require('querystring');

const argv = minimist(process.argv.slice(2));

class GulpToolboxRegistry extends DefaultRegistry {
  constructor(opt) {
    super();

    const store = {};

    store.toolboxes = opt.toolboxes;
    store.config = new Uberconfig(opt.config);
    store.toolboxTasks = [];
    store.getRelatedFiles = {};

    this._toolboxStore = store;
    this.get = this.get.bind(this);
  }
  init(gulp) {
    super.init();

    const store = this._toolboxStore;

    store.gulp = gulp;
    store.toolboxes
      .filter(validate)
      .map((toolbox) => {
        toolbox._originalConfig = toolbox.config;
        toolbox.config = store.config.request(
          toolbox.config,
          conflictHandler(toolbox.meta)
        );
        return toolbox;
      })
      .map(toTask(store))
      .forEach((task) => {
        store.toolboxTasks.push(task);
        gulp.task(task);
      });
  }
  get(originalName, allowFwd) {
    const store = this._toolboxStore;
    const nameParts = originalName.split('?');
    const name = nameParts[0];
    const query = querystring.parse(nameParts[1]);
    var task = super.get(name);

    if (!task) {
      task = provideFwdRef(
        originalName,
        allowFwd,
        this.get,
        store.toolboxTasks
          .filter(startsWith(name))
          .filter(skip(name, argv))
          .reduce(group(store.gulp), null)
      );
    }

    if (task && query.watch !== 'false' && argv.watch) {
      return watch(task, store);
    }

    return task;
  }
}

module.exports = GulpToolboxRegistry;
