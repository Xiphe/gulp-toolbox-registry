'use strict';

const TaksProviderRegistry = require('undertaker-task-provider-registry');
const PluginUberconfig = require('./plugins/uberconfig');
const pluginMetaDescription = require('./plugins/pluginMetaDescription');
const PluginForewardRef = require('./plugins/PluginForewardRef');
const PluginAutoWatch = require('./plugins/PluginAutoWatch');
const PluginDecorateSrc = require('./plugins/PluginDecorateSrc');
const pluginMetaName = require('./plugins/pluginMetaName');
const PluginGroupTasks = require('./plugins/groupTasks');

module.exports = class GulpToolboxRegistry extends TaksProviderRegistry {
  constructor(opt) {
    super({
      providers: opt.toolboxes,
      plugins: [
        pluginMetaName,
        pluginMetaDescription,
        new PluginForewardRef(),
        new PluginDecorateSrc(),
        new PluginUberconfig(opt.config),
        new PluginGroupTasks(),
        new PluginAutoWatch(opt.config)
      ]
    });
  }
};
