'use strict';

const DefaultRegistry = require('undertaker-registry');
const minimist = require('minimist');
const Configurator = require('./Configurator');
const validate = require('./validate');
const toTask = require('./toTask');
const startsWith = require('./startsWith');
const group = require('./group');
const skip = require('./skip');
const provideFwdRef = require('./provideFwdRef');

const argv = minimist(process.argv.slice(2));

class GulpToolboxRegistry extends DefaultRegistry {
  constructor(opt) {
    super();

    this._toolboxStore = {};
    this._toolboxStore.toolboxes = opt.toolboxes;
    this._toolboxStore.hooks = opt.hooks;
    this._toolboxStore.toolboxConfigurator = new Configurator(opt.config);
    this._toolboxStore.toolboxTasks = [];

    this.get = this.get.bind(this);
  }
  init(gulp) {
    super.init();

    this._toolboxStore.gulp = gulp;
    this._toolboxStore.toolboxes
      .filter(validate)
      .map(this._toolboxStore.toolboxConfigurator.attachConfig)
      .map(toTask(gulp))
      .forEach((task) => {
        this._toolboxStore.toolboxTasks.push(task);
        gulp.task(task);
      });

    this._toolboxStore.toolboxConfigurator.validate();
  }
  get(name, allowFwd) {
    const defaultTask = super.get(name);

    if (!defaultTask) {
      return provideFwdRef(
        name,
        allowFwd,
        this.get,
        this._toolboxStore.toolboxTasks
          .filter(startsWith(name))
          .filter(skip(name, argv))
          .reduce(group(this._toolboxStore.gulp), null)
      );
    }

    return defaultTask;
  }
}

module.exports = GulpToolboxRegistry;
