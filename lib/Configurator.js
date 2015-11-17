'use strict';

var _ = require('lodash');
var dot = require('dot-object');
var archy = require('archy');
var assert = require('assert');
var path = require('path');
var chalk = require('chalk');

module.exports = class Configurator {
  constructor(config) {
    this.config = config;
    this.requests = [];
    this.defaultsCompat = {};
  }
  requestFor(toolboxName, toolboxMeta) {
    return (requests) => {
      var response = {};

      _.forEach(requests, (config, key) => {
        var request = {
          toolboxName,
          toolboxMeta,
          config,
          response,
          key
        };

        this.respond(request);
        this.requests.push(request);
      });

      return response;
    };
  }
  respond(request) {
    var value = dot.pick(request.key, this.config);

    if (_.isUndefined(value)) {
      value = request.config.default;
    } else {
      assert.ok(
        value instanceof request.config.default.constructor,
        chalk.red(
          `config value for "${request.key}"` +
          ` must be of type ${request.config.default.constructor.name}`
        )
      );
    }

    request.response[request.config.as || request.key] = value;
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
    var tree = [];

    compat.sort((compatA, compatB) => {
      if (compatA.requests.length > compatB.requests.length) {
        return -1;
      } else if (compatA.requests.length < compatB.requests.length) {
        return 1;
      }
      return 0;
    }).forEach((entry) => {
      var usedBy = [];

      entry.requests.forEach((request) => {
        usedBy.push(request.toolboxName);
      });

      tree.push({
        label: `value ${JSON.stringify(entry.default)} used by:`,
        nodes: usedBy
      });
    });

    return tree;
  }
  getMembers(compat) {
    var members = {};

    compat.forEach((entry) => {
      entry.requests.forEach((request) => {
        members[request.toolboxName] = request;
      });
    });

    return members;
  }
  getDefaultsCompatError(compat, key) {
    var tree = this.getCompatTree(compat);
    var members = this.getMembers(compat);
    var errBody = null;
    var errNotifications = '';
    var errTitle = null;

    errBody = archy({
      nodes: tree
    });
    errTitle = `conflicting default values for "${key}"`;

    _.forEach(members, (request, toolboxName) => {
      errNotifications += `\n - ${toolboxName}: ` +
        `${this.notify(errTitle, errBody, request)}`;
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
      const errBody = ` - toolbox: "${request.toolboxName}"\n` +
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
