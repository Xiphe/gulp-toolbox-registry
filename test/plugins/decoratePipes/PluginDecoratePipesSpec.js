'use strict';

const proxyquire = require('proxyquire');

describe('PluginDecoratePipes', () => {
  let PluginDecoratePipes = null;
  let noopPipe = null;

  function getHelper(pipes, plugins) {
    const pluginDecoratePipes = new PluginDecoratePipes(pipes, plugins);

    return pluginDecoratePipes.decorateHelper({ helper: {} }).helper;
  }

  function errorMatching(str) {
    return {
      asymmetricMatch(actual) {
        expect(actual).toEqual(jasmine.any(Error));
        expect(actual.message).toEqual(jasmine.stringMatching(str));
        return true;
      },
    };
  }

  beforeEach(() => {
    noopPipe = { id: Symbol('someId') };
    PluginDecoratePipes = proxyquire(
      '../../../lib/plugins/decoratePipes/PluginDecoratePipes',
      {
        './noopPipe': noopPipe,
      }
    );
  });

  it('decorates a getPipe method to helper', () => {
    const helper = getHelper([], []);

    expect(helper.getPipe).toEqual(jasmine.any(Function));
  });

  describe('getPipe', () => {
    it('provides pipes passed to constructor', () => {
      const name = 'foo';
      const fakePipe = Symbol('fakePipe');
      const fakePipeProvider = {
        meta: {
          name: `gulp-toolbox-pipe-${name}`,
        },
        get() {
          return fakePipe;
        },
      };
      const helper = getHelper([fakePipeProvider], []);

      expect(helper.getPipe(name)).toBe(fakePipe);
    });

    it('throws if pipe is not registered', () => {
      const helper = getHelper([], []);
      const name = 'bar';

      expect(() => {
        helper.getPipe(name);
      }).toThrow(errorMatching(`Pipe '${name}' not defined`));
    });

    it('provides a noop-pipe if called with optional param', () => {
      expect(getHelper([], []).getPipe('bar', { optional: true }))
        .toBe(noopPipe);
    });
  });
});
