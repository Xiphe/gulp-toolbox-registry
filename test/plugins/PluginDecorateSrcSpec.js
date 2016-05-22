'use strict';

const PluginDecorateSrc = require('../../lib/plugins/PluginDecorateSrc');

describe('PluginDecorateSrc', () => {
  it('decorates the src method of a given takerInst to helper', () => {
    const src = Symbol('src');
    const pluginDecorateSrc = new PluginDecorateSrc();
    pluginDecorateSrc.init({ takerInst: { src } });
    const helper = pluginDecorateSrc.decorateHelper({ helper: {} }).helper;

    expect(helper.src).toBe(src);
  });
});
