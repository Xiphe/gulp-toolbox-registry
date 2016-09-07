'use strict';

const proxyquire = require('proxyquire');

let fakeConflictHandler = null;
let fakeValidations = [];
let PluginUberconfig = null;

describe('PluginUberconfig', () => {
  beforeEach(() => {
    fakeValidations = [];
    fakeValidations['@noCallThru'] = true;
    fakeConflictHandler = jasmine.createSpy('conflictHandler');
    PluginUberconfig = proxyquire(
      '../../../lib/plugins/uberconfig/PluginUberconfig',
      {
        './conflictHandler': fakeConflictHandler,
        './validations': fakeValidations,
      }
    );
  });

  describe('validate', () => {
    it('runs all validations with given toolbox', () => {
      const validation1 = jasmine.createSpy('validation1');
      const validation2 = jasmine.createSpy('validation2');
      const someToolbox = Symbol('someToolbox');

      fakeValidations.push(validation1);
      fakeValidations.push(validation2);

      const pluginUberconfig = new PluginUberconfig();

      pluginUberconfig.validate(someToolbox);

      expect(validation1).toHaveBeenCalledWith(someToolbox);
      expect(validation2).toHaveBeenCalledWith(someToolbox);
    });
  });

  describe('decorateProvider', () => {
    it('puts gets resolves the toolbox configuration', () => {
      const toolbox = {
        meta: Symbol('meta'),
        config: Symbol('config'),
      };
      const uberconfigResponse = Symbol('uberconfigResponse');
      const fakeUberconfig = {
        request: jasmine.createSpy('request').and.returnValue(uberconfigResponse),
      };
      const conflictHandlerResponse = Symbol('conflictHandlerResponse');
      const pluginUberconfig = new PluginUberconfig(fakeUberconfig);

      fakeConflictHandler.and.returnValue(conflictHandlerResponse);
      Object.freeze(toolbox);

      const decoratedToolbox = pluginUberconfig.decorateProvider(toolbox);

      expect(decoratedToolbox).toBe(toolbox);
      expect(pluginUberconfig.configMap.get(toolbox)).toBe(uberconfigResponse);
      expect(fakeConflictHandler).toHaveBeenCalledWith(toolbox.meta);
    });

    it('does nothing when the toolbox has no configuration', () => {
      const pluginUberconfig = new PluginUberconfig();
      const toolbox = {};

      spyOn(pluginUberconfig.configMap, 'set');
      Object.freeze(toolbox);

      const decoratedToolbox = pluginUberconfig.decorateProvider(toolbox);

      expect(decoratedToolbox).toBe(toolbox);
      expect(pluginUberconfig.configMap.set).not.toHaveBeenCalled();
    });
  });

  describe('decorateHelper', () => {
    it('adds a getConfig method to helper', () => {
      const pluginUberconfig = new PluginUberconfig();

      const helper = pluginUberconfig.decorateHelper(
        { helper: {} }
      ).helper;

      expect(typeof helper.getConfig).toBe('function');
    });

    describe('getConfig', () => {
      it('gets configuration from internal map using toolbox', () => {
        const provider = {};
        const someConfigValue = Symbol('someConfigValue');
        const pluginUberconfig = new PluginUberconfig();

        pluginUberconfig.configMap.set(provider, someConfigValue);

        const helper = pluginUberconfig.decorateHelper(
          { helper: {}, provider }
        ).helper;

        expect(helper.getConfig()).toBe(someConfigValue);
      });
    });
  });
});
