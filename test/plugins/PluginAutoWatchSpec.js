'use strict';

const proxyquire = require('proxyquire');
const deepFreeze = require('deep-freeze');

function buildFakeTask(config) {
  const fakeTask = {
    name: 'lorem',
    provider: {
      config,
    },
  };
  const args = { task: fakeTask };

  deepFreeze(args);

  return args;
}

describe('PluginAutoWatch', () => {
  let PluginAutoWatch = null;
  let FakeUberconfig = null;
  let fakeUberconfig = null;
  let pluginAutoWatch = null;
  let fakeArgv = null;
  let fakeLogger = null;

  beforeEach(() => {
    fakeUberconfig = jasmine.createSpyObj('uberconfig', ['get']);
    fakeLogger = jasmine.createSpyObj('logger', ['info']);
    FakeUberconfig = jasmine.createSpy('Uberconfig')
      .and.returnValue(fakeUberconfig);
    fakeArgv = {
      watch: true,
    };

    PluginAutoWatch = proxyquire('../../lib/plugins/PluginAutoWatch', {
      uberconfig: FakeUberconfig,
      gulplog: fakeLogger,
      '../argv': fakeArgv,
    });
  });

  it('creates a new uberconfig on creation', () => {
    const someConfig = Symbol('config');

    pluginAutoWatch = new PluginAutoWatch(someConfig);

    expect(FakeUberconfig).toHaveBeenCalledWith(someConfig);
  });

  describe('get', () => {
    it('does nothing if the toolbox has no config', () => {
      const fakeTask = { name: 'Foo', provider: Symbol('provider') };
      const args = { task: fakeTask };
      deepFreeze(args);

      pluginAutoWatch = new PluginAutoWatch({});
      pluginAutoWatch.decorateTask(fakeTask);

      const otherArgs = pluginAutoWatch.get(args);

      expect(otherArgs).toBe(args);
    });

    it('does nothing if watch is not active', () => {
      const args = buildFakeTask({
        'files.bar': 'bar.js',
      });

      fakeArgv.watch = false;
      pluginAutoWatch = new PluginAutoWatch({});

      const otherArgs = pluginAutoWatch.get(args);

      expect(otherArgs).toBe(args);
    });

    it('does nothing if task has no files', () => {
      const args = buildFakeTask({
        'not.a.file': 'foo.js',
      });

      pluginAutoWatch = new PluginAutoWatch({});
      pluginAutoWatch.decorateTask(args.task);

      const otherArgs = pluginAutoWatch.get(args);

      expect(otherArgs).toBe(args);
    });

    it('returns a new task when task has files', () => {
      const args = buildFakeTask({
        'files.bar': 'bar.js',
      });

      pluginAutoWatch = new PluginAutoWatch({});
      pluginAutoWatch.decorateTask(args.task);

      const otherArgs = pluginAutoWatch.get(args);

      expect(otherArgs.task).not.toBe(args.task);
      expect(typeof otherArgs.task).toBe('function');
    });

    it('wraps the task with a watcher on related files', () => {
      const relatedFiles = ['foo.js', 'bar.js'];
      const args = buildFakeTask({
        'files.foo': relatedFiles[0],
        'files.bar': relatedFiles[1],
      });
      const fakeTaker = jasmine.createSpyObj('takerInst', [
        'watch',
        'series',
      ]);
      const fakeDone = jasmine.createSpy('done');
      const taskWithWaitingLog = jasmine.createSpy('taskWithWaitingLog');
      let i = 0;

      fakeTaker.series.and.returnValue(taskWithWaitingLog);
      fakeUberconfig.get.and.callFake(() => relatedFiles[i++]);
      pluginAutoWatch = new PluginAutoWatch({});
      pluginAutoWatch.init({ takerInst: fakeTaker });
      pluginAutoWatch.decorateTask(args.task);

      const otherArgs = pluginAutoWatch.get(args);

      otherArgs.task();

      expect(fakeTaker.series).toHaveBeenCalledWith([
        args.task,
        jasmine.any(Function),
      ]);

      expect(fakeTaker.watch).toHaveBeenCalledWith(
        relatedFiles,
        jasmine.any(Function)
      );

      fakeTaker.series.calls.argsFor(0)[0][1](fakeDone);

      expect(fakeDone).toHaveBeenCalled();
      expect(fakeLogger.info).toHaveBeenCalled();
    });
  });
});
