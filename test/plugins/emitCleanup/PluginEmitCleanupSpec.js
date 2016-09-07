'use strict';

const proxyquire = require('proxyquire');
const events = require('events');

const EventEmitter = events.EventEmitter;

describe('PluginEmitCleanup', () => {
  let pluginEmitCleanup = null;
  let fakeLogger = null;
  let fakeProcess = null;
  let emitSpy = null;
  let helper = null;
  let exitSpy = null;

  beforeEach(() => {
    fakeLogger = jasmine.createSpyObj('logger', ['error', 'info']);
    exitSpy = jasmine.createSpy('exit');
    fakeProcess = new EventEmitter();
    fakeProcess.exit = exitSpy;
    emitSpy = jasmine.createSpy('emit');
    helper = { emit: emitSpy };
    const PluginEmitCleanup = proxyquire(
      '../../../lib/plugins/emitCleanup/PluginEmitCleanup',
      {
        './process': fakeProcess,
        gulplog: fakeLogger,
      }
    );
    pluginEmitCleanup = new PluginEmitCleanup();
    pluginEmitCleanup.decorateHelper({ helper });
  });

  it('emits cleanup on helper when process exits', () => {
    fakeProcess.emit('exit');

    expect(emitSpy).toHaveBeenCalledWith('cleanup');
  });

  it('logs given error and exits on uncaughtException', () => {
    const someMessage = 'foo';
    const someError = new Error(someMessage);

    fakeProcess.emit('uncaughtException', someError);

    expect(fakeLogger.error).toHaveBeenCalledWith(someMessage);
    expect(fakeLogger.info).toHaveBeenCalled();
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('exits on SIGINT', () => {
    fakeProcess.emit('SIGINT');

    expect(exitSpy).toHaveBeenCalledWith(0);
  });
});
