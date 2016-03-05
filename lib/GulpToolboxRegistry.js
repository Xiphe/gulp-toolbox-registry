'use strict';

const TaksProviderRegistry = require('undertaker-task-provider-registry');
const PluginUberconfig = require('./plugins/uberconfig');
const pluginMetaDescription = require('./plugins/pluginMetaDescription');
const PluginForewardRef = require('./plugins/PluginForewardRef');
const PluginAutoWatch = require('./plugins/PluginAutoWatch');
const PluginDecoratePipes = require('./plugins/PluginDecoratePipes');
const DecorateEventEmitter = require('./plugins/PluginDecorateEventEmitter');
const PluginDecorateSrc = require('./plugins/PluginDecorateSrc');
const pluginMetaName = require('./plugins/pluginMetaName');
const PluginGroupTasks = require('./plugins/groupTasks');
const Uberconfig = require('uberconfig');

module.exports = class GulpToolboxRegistry extends TaksProviderRegistry {
  constructor(opt) {
    const uberconfig = new Uberconfig(opt.config, {
      envPrefix: 'GULP_TOOLBOX_',
      cliPrefix: '',
    });
    const uberconfigPlugin = new PluginUberconfig(uberconfig);
    const decorateEventEmitter = new DecorateEventEmitter();

    super({
      providers: opt.toolboxes,
      plugins: [
        pluginMetaName,
        pluginMetaDescription,
        uberconfigPlugin,
        decorateEventEmitter,
        new PluginForewardRef(),
        new PluginDecoratePipes(opt.pipes, [
          uberconfigPlugin,
          decorateEventEmitter,
        ]),
        new PluginDecorateSrc(),
        new PluginGroupTasks(),
        new PluginAutoWatch(opt.config),
      ],
    });
  }
};
