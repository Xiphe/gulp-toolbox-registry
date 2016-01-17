'use strict';

const _ = require('lodash');
const dot = require('dot-object');
const archy = require('archy');
const assert = require('assert');
const path = require('path');
const chalk = require('chalk');

module.exports = class Configurator {
  constructor(config) {
    this.config = config;
    this.requests = [];
    this.defaultsCompat = {};

    this.attachConfig = this.attachConfig.bind(this);
  }
  attachConfig(toolbox) {
    const toolboxWithConfig = _.merge({}, toolbox);

    toolboxWithConfig.config = this.getConfig(toolbox);

    return toolboxWithConfig;
  }
  isSameType(valA, valB) {
    if (_.isObject(valA) && !_.isPlainObject(valA) ||
      _.isObject(valB) && !_.isPlainObject(valB)
    ) {
      return valA instanceof valB.constructor;
    }

    return typeof valA === typeof valB;
  }
  getConfig(toolbox) {
    const response = {};

    _.forEach(toolbox.config, (config, key) => {
      var value = dot.pick(key, this.config);

      this.requests.push({
        toolboxMeta: toolbox.meta,
        config,
        key
      });

      if (_.isUndefined(value)) {
        value = config.default;
      } else {
        assert.ok(
          this.isSameType(value, config.default),
          chalk.red(
            `config value for "${key}"` +
            ` must be of type ${config.default.constructor.name}` +
            ` but is ${value.constructor.name}`
          )
        );
      }

      response[config.as || key] = value;
    });

    return dot.object(response);
  }
  notify(title, msg, request) {
    return chalk.cyan(
      `${path.join(request.toolboxMeta.bugs, 'new')}` +
        `?title=${encodeURIComponent(title)}&body=${encodeURIComponent(msg)}`
    );
  }
  addDefaultsCompat(request) {
    var found = false;

    if (!this.defaultsCompat[request.key]) {
      this.defaultsCompat[request.key] = [];
    }

    this.defaultsCompat[request.key].forEach((entry) => {
      if (_.isEqual(request.config.default, entry.default)) {
        entry.requests.push(request);
        found = true;
      }
    });

    if (!found) {
      this.defaultsCompat[request.key].push({
        default: request.config.default,
        requests: [request]
      });
    }
  }
  getCompatTree(compat) {
    const tree = [];

    compat.sort((compatA, compatB) => {
      if (compatA.requests.length > compatB.requests.length) {
        return -1;
      } else if (compatA.requests.length < compatB.requests.length) {
        return 1;
      }
      return 0;
    }).forEach((entry) => {
      const usedBy = [];

      entry.requests.forEach((request) => {
        usedBy.push(request.toolboxMeta.name);
      });

      tree.push({
        label: `value ${JSON.stringify(entry.default)} used by:`,
        nodes: usedBy
      });
    });

    return tree;
  }
  getMembers(compat) {
    const members = {};

    compat.forEach((entry) => {
      entry.requests.forEach((request) => {
        members[request.toolboxMeta.name] = request;
      });
    });

    return members;
  }
  getDefaultsCompatError(compat, key) {
    const tree = this.getCompatTree(compat);
    const members = this.getMembers(compat);
    var errBody = archy({
      nodes: tree
    });
    const wrappedErrBody = `\`\`\`${errBody}\`\`\``;
    var errNotifications = '';
    const errTitle = `conflicting default values for "${key}"`;

    _.forEach(members, (request, toolboxName) => {
      errNotifications += `\n - ${toolboxName}: ` +
        `${this.notify(errTitle, wrappedErrBody, request)}`;
    });

    errBody += `\nplease notify the authors:${errNotifications}`;

    return `${chalk.red(errTitle)}${errBody}\n`;
  }
  validateDefaultsCompat() {
    _.forEach(this.defaultsCompat, (compat, key) => {
      assert.ok(
        compat.length <= 1,
        this.getDefaultsCompatError(compat, key)
      );
    });
  }
  validate() {
    this.requests.forEach((request) => {
      const errTitle = `default value for "${request.key}"` +
        ` can not be undefined`;
      const errBody = ` - toolbox: "${request.toolboxMeta.name}"\n` +
        ` - configKey: "${request.key}"\n`;

      assert.ok(
        !_.isUndefined(request.config.default),
        `${chalk.red(errTitle)}\n${errBody}\n` +
        `please notify the author:\n` +
        `  ${this.notify(errTitle, errBody, request)}\n`
      );

      this.addDefaultsCompat(request);
    });

    this.validateDefaultsCompat();
  }
};
