'use strict';

const DefaultRegistry = require('undertaker-registry');
const minimist = require('minimist');
const Configurator = require('./Configurator');
const Validator = require('./Validator');
const toTask = require('./toTask');
const startsWith = require('./startsWith');
const group = require('./group');
const skip = require('./skip');
const provideFwdRef = require('./provideFwdRef');

const argv = minimist(process.argv.slice(2));

class GulpToolboxRegistry extends DefaultRegistry {
  constructor(opt) {
    super();

    this._toolboxes = opt.toolboxes;
    this._hooks = opt.hooks;
    this._toolboxConfigurator = new Configurator(opt.config);
    this._toolboxValidator = new Validator();
    this._toolboxTasks = [];

    this.get = this.get.bind(this);
  }
  init(gulp) {
    super.init();

    this._gulp = gulp;
    this._toolboxes
      .filter(this._toolboxValidator.isValid)
      .map(this._toolboxConfigurator.attachConfig)
      .map(toTask(gulp))
      .forEach((task) => {
        this._toolboxTasks.push(task);
        gulp.task(task);
      });

    this._toolboxValidator.validate();
    this._toolboxConfigurator.validate();
  }
  get(name, allowFwd) {
    const defaultTask = super.get(name);

    if (!defaultTask) {
      return provideFwdRef(
        name,
        allowFwd,
        this.get,
        this._toolboxTasks
          .filter(startsWith(name))
          .filter(skip(name, argv))
          .reduce(group(this._gulp), null)
      );
    }

    return defaultTask;
  }
}

module.exports = GulpToolboxRegistry;
