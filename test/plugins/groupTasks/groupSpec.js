'use strict';

const groupFactory = require('../../../lib/plugins/groupTasks/group');

describe('groupFactory', () => {
  it('returns a group function', () => {
    expect(typeof groupFactory()).toBe('function');
  });
});

describe('group reducer', () => {
  it('directly returns task if its the only one', () => {
    const group = groupFactory();
    const task = Symbol('fixture');
    const tasks = [task];

    expect(group(null, task, 0, tasks)).toBe(task);
  });

  it('gets the task from takerInst and pushes it to collection', () => {
    const fakeTakerTask = Symbol('fixture');
    const fakeTakerInst = {
      task: jasmine.createSpy('task').and.returnValue(fakeTakerTask),
    };
    const group = groupFactory(fakeTakerInst);
    const displayName = 'foo';
    const anotherTask = { displayName };
    const tasks = [anotherTask, Symbol('fixture')];

    const groupedTasks = group(null, anotherTask, 0, tasks);

    expect(groupedTasks instanceof Array).toBe(true);
    expect(groupedTasks[0]).toBe(fakeTakerTask);
    expect(fakeTakerInst.task).toHaveBeenCalledWith(displayName);
  });

  it('wraps the collection for parallel call on last task', () => {
    const fakeTakerTask = Symbol('fixture');
    const fakeParalleled = Symbol('fixture');
    const fakeTakerInst = {
      task: jasmine.createSpy('task').and.returnValue(fakeTakerTask),
      parallel: jasmine.createSpy('parallel').and.returnValue(fakeParalleled),
    };
    const group = groupFactory(fakeTakerInst);
    const name = 'bar';
    const anotherTask = { name };
    const tasks = [Symbol('fixture'), anotherTask];
    const collection = [fakeTakerTask];

    expect(group(collection, anotherTask, 1, tasks)).toBe(fakeParalleled);
    expect(fakeTakerInst.task).toHaveBeenCalledWith(name);
  });
});
