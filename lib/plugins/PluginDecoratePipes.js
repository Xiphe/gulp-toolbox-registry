'use strict';

const Undertaker = require('undertaker');
const TaksProviderRegistry = require('undertaker-task-provider-registry');
const pluginMetaName = require('./pluginMetaName');
const through2 = require('through2');

const noopPipe = through2.obj(
  (chunk, __, cb) => {cb(null, chunk);},
  (cb) => {cb();}
);

/* TaskProviderRegistry expects provider.get to return a function */
const wrapFakeTaskPlugin = {
  decorateProvider: (provider) => {
    const originGet = provider.get;

    return Object.assign({}, provider, {
      get(helper) {
        return () => originGet(helper);
      },
    });
  },
};

module.exports = class PluginDecoratePipes {
  constructor(pipes, plugins) {
    this.pipes = new Undertaker(
      new TaksProviderRegistry({
        providers: pipes,
        plugins: [
          wrapFakeTaskPlugin,
          pluginMetaName,
        ].concat(plugins),
      })
    );
  }
  decorateHelper(args) {
    const pipes = this.pipes;

    return Object.assign({}, args, {
      helper: Object.assign({}, args.helper, {
        getPipe(name, opts) {
          const pipe = pipes.task(`pipe:${name}`)();

          if (!pipe) {
            if (opts && opts.optional) {
              return noopPipe;
            }

            throw new Error(`Pipe '${name}' not defined before use`);
          }

          return pipe;
        },
      }),
    });
  }
};
