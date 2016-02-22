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

    provider.get = (helper) => {
      return () => {
        return originGet(helper);
      };
    };

    return provider;
  }
};

module.exports = class PluginDecoratePipes {
  constructor(pipes, uberconfigPlugin) {
    this.pipes = new Undertaker(
      new TaksProviderRegistry({
        providers: pipes,
        plugins: [
          wrapFakeTaskPlugin,
          pluginMetaName,
          uberconfigPlugin
        ]
      })
    );
  }
  decorateHelper(args) {
    const pipes = this.pipes;

    args.helper.getPipe = function getPipe(name, opts) {
      const pipe = pipes.task(`pipe:${name}`)();

      if (!pipe) {
        if (opts && opts.optional) {
          return noopPipe;
        }

        throw new Error(`Pipe '${name}' not defined before use`);
      }

      return pipe;
    };

    return args;
  }
};
