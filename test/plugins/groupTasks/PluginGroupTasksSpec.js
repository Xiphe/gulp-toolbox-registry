'use strict';

const proxyquire = require('proxyquire');

describe('PluginGroupTasks', () => {
  let pluginGroupTasks = null;
  let fakeStartsWith = null;
  let fakeSkip = null;
  let fakeGroup = null;

  beforeEach(() => {
    fakeStartsWith = jasmine.createSpy('startsWith');
    fakeSkip = jasmine.createSpy('skip');
    fakeGroup = jasmine.createSpy('group');

    const PluginGroupTasks = proxyquire(
      '../../../lib/plugins/groupTasks/PluginGroupTasks',
      {
        './startsWith': () => fakeStartsWith,
        './skip': () => fakeSkip,
        './group': () => fakeGroup,
      }
    );

    pluginGroupTasks = new PluginGroupTasks();
  });

  describe('init', () => {
    it('puts a given store aside for later usage', () => {
      const someStore = Symbol();

      pluginGroupTasks.init(someStore);

      expect(pluginGroupTasks.store).toBe(someStore);
    });
  });

  describe('get', () => {
    it('does nothing if a task was found', () => {
      const args = { task: true };
      Object.freeze(args);

      expect(pluginGroupTasks.get(args)).toBe(args);
    });

    it('builds a grouped task from store', () => {
      const aTask = Symbol();
      const store = {
        tasks: [aTask],
      };
      const name = 'fuchs';
      const args = { name };
      const theGroup = Symbol();
      const at = jasmine.anything();

      Object.freeze(args);
      pluginGroupTasks.store = store;
      fakeStartsWith.and.returnValue(true);
      fakeSkip.and.returnValue(true);
      fakeGroup.and.returnValue(theGroup);

      const newArgs = pluginGroupTasks.get(args);

      expect(newArgs.task).toBe(theGroup);
      expect(newArgs.name).toBe(name);
      expect(fakeStartsWith).toHaveBeenCalledWith(aTask, at, at);
      expect(fakeSkip).toHaveBeenCalledWith(aTask, at, at);
    });

    it('does nothing if no group could be formed', () => {
      const aTask = Symbol();
      const store = {
        tasks: [aTask],
      };
      const name = 'igel';
      const args = { name };

      Object.freeze(args);
      pluginGroupTasks.store = store;
      fakeStartsWith.and.returnValue(true);
      fakeSkip.and.returnValue(true);
      fakeGroup.and.returnValue(null);

      expect(pluginGroupTasks.get(args)).toBe(args);
    });
  });
});
