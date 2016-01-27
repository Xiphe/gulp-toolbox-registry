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

    this._toolboxStore = {};
    this._toolboxStore.toolboxes = opt.toolboxes;
    this._toolboxStore.config = new Uberconfig(opt.config);
    this._toolboxStore.toolboxTasks = [];
    this._toolboxStore.getRelatedFiles = {};

    this.get = this.get.bind(this);
  }
  init(gulp) {
    super.init();

    this._toolboxStore.gulp = gulp;
    this._toolboxStore.toolboxes
      .filter(validate)
      .map((toolbox) => {
        toolbox._originalConfig = toolbox.config;
        toolbox.config = this._toolboxStore.config.request(
          toolbox.config,
          conflictHandler(toolbox.meta)
        );
        return toolbox;
      })
      .map(toTask(this._toolboxStore))
      .forEach((task) => {
        this._toolboxStore.toolboxTasks.push(task);
        gulp.task(task);
      });
  }
  get(originalName, allowFwd) {
    const nameParts = originalName.split('?');
    const name = nameParts[0];
    const query = querystring.parse(nameParts[1]);
    var task = super.get(name);

    if (!task) {
      task = provideFwdRef(
        originalName,
        allowFwd,
        this.get,
        this._toolboxStore.toolboxTasks
          .filter(startsWith(name))
          .filter(skip(name, argv))
          .reduce(group(this._toolboxStore.gulp), null)
      );
    }

    if (task && query.watch !== 'false' && argv.watch) {
      return watch(task, this._toolboxStore);
    }

    return task;
  }
}

module.exports = GulpToolboxRegistry;
