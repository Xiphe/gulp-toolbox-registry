'use strict';

const proxyquire = require('proxyquire');

describe('noopPipe', () => {
  it('passes noop callbacks to through2', () => {
    const throughWrappedThing = Symbol('throughWrappedThing');
    const obj = jasmine.createSpy('through2.obj')
      .and.returnValue(throughWrappedThing);
    const noopPipe = proxyquire(
      '../../../lib/plugins/decoratePipes/noopPipe',
      {
        through2: { obj },
      }
    );

    expect(noopPipe).toBe(throughWrappedThing);
    expect(obj).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.any(Function)
    );

    const cb1 = jasmine.createSpy('cb1');
    const someChunk = Symbol('someChunk');

    obj.calls.argsFor(0)[0](someChunk, undefined, cb1);
    expect(cb1).toHaveBeenCalledWith(null, someChunk);

    const cb2 = jasmine.createSpy('cb2');
    obj.calls.argsFor(0)[1](cb2);
    expect(cb2).toHaveBeenCalled();
  });
});
