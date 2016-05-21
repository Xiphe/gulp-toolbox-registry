'use strict';

const PluginDecorateEventEmitter = require('../../lib/plugins/PluginDecorateEventEmitter');

describe('PluginDecorateEventEmitter', () => {
  let pluginDecorateEventEmitter = null;

  beforeEach(() => {
    pluginDecorateEventEmitter = new PluginDecorateEventEmitter();
  });

  it('should decorate common emitter methods to helper', () => {
    const result = pluginDecorateEventEmitter.decorateHelper({ helper: {} });

    expect(result.helper.on).toEqual(jasmine.any(Function));
    expect(result.helper.once).toEqual(jasmine.any(Function));
    expect(result.helper.emit).toEqual(jasmine.any(Function));
    expect(result.helper.removeListener).toEqual(jasmine.any(Function));
  });

  it('should enable communication between two helpers', () => {
    const helperA = pluginDecorateEventEmitter.decorateHelper({ helper: {} }).helper;
    const helperB = pluginDecorateEventEmitter.decorateHelper({ helper: {} }).helper;
    const onFooSpy = jasmine.createSpy('onFoo');
    const payload = Symbol('bar');

    helperA.on('foo', onFooSpy);
    helperB.emit('foo', payload);

    expect(onFooSpy).toHaveBeenCalledWith(payload);
  });

  it('should handle async event listeners', (done) => {
    let next = null;
    let sanity = false;
    const helperA = pluginDecorateEventEmitter.decorateHelper({ helper: {} }).helper;
    const helperB = pluginDecorateEventEmitter.decorateHelper({ helper: {} }).helper;
    const doneSpy = jasmine.createSpy('done').and.callFake(() => {
      expect(sanity).toBe(true);
      done();
    });

    helperA.on('foo', (e, _next) => {
      next = _next;
    });
    helperB.emit('foo', doneSpy);

    expect(doneSpy).not.toHaveBeenCalled();

    setTimeout(() => {
      sanity = true;
      next();
    }, 5);
  });
});
