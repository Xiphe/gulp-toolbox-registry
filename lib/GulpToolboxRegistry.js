'use strict';

var DefaultRegistry = require('undertaker-registry');
var minimist = require('minimist');
var Configurator = require('./Configurator');
var Validator = require('./Validator');
var toTask = require('./toTask');
var startsWith = require('./startsWith');
var group = require('./group');
var skip = require('./skip');
var provideFwdRef = require('./provideFwdRef');

var argv = minimist(process.argv.slice(2));

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
