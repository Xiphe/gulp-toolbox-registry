'use strict';

const logger = require('gulplog');
const process = require('./process');

/* based on http://stackoverflow.com/a/14032965/1468875 */
module.exports = class PluginEmitCleanup {
  constructor() {
    process.on(
      'exit',
      this.exitHandler.bind(this, { cleanup: true })
    );
    process.on(
      'SIGINT',
      this.exitHandler.bind(this, { exit: true })
    );
    process.on(
      'uncaughtException',
      this.exitHandler.bind(this, { exit: true })
    );
  }
  exitHandler(options, err) {
    if (options.cleanup && this.helper && this.helper.emit) {
      this.helper.emit('cleanup');
    }

    if (err && err.message && err.stack) {
      logger.error(err.message);
      logger.info(err.stack);
    }

    if (options.exit) {
      // suppress exit warnings
      logger.warn = () => {};
      process.exit(err ? 1 : 0);
    }
  }
  decorateHelper(args) {
    this.helper = args.helper;

    return args;
  }
};
