/* eslint prefer-rest-params: 0 */
'use strict';

const PluginForwardRef = require('../../lib/plugins/PluginForwardRef');
const errorMatching = require('../helper/errorMatching');

describe('PluginForwardRef', () => {
  let fakeRegistry = null;
  let pluginForwardRef = null;

  beforeEach(() => {
    fakeRegistry = jasmine.createSpyObj('registry', ['get']);
    pluginForwardRef = new PluginForwardRef();
    pluginForwardRef.init({
      takerInst: {
        registry() {
          return fakeRegistry;
        },
      },
    });
  });

  it('provides a task even if there is none registered yet', () => {
    const task = pluginForwardRef.get({ name: 'foo', arguments: [] }).task;

    expect(task).toEqual(jasmine.any(Function));
  });

  it('does not provide a task when there is no name given', () => {
    const noTask = pluginForwardRef.get({}).task;

    expect(noTask).toBeUndefined();
  });

  describe('forward referenced task', () => {
    it('throws when task has not been registered before execution', () => {
      const taskName = 'foo';

      fakeRegistry.get.and.callFake(function get(name) {
        return pluginForwardRef.get({ name, arguments: arguments }).task;
      });
      const task = pluginForwardRef.get({ name: taskName, arguments: [] }).task;

      expect(() => {
        task();
      }).toThrow(errorMatching(`task '${taskName}' not defined`));
    });

    it('executes the real task on execution', () => {
      const task = jasmine.createSpy('task');
      const fakeDone = Symbol('done');
      fakeRegistry.get.and.returnValue(task);

      const forwardRefTask = pluginForwardRef.get({ name: 'foo', arguments: [] }).task;
      forwardRefTask(fakeDone);

      expect(task).toHaveBeenCalledWith(fakeDone);
    });
  });
});
