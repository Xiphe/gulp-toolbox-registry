'use strict';

const proxyquire = require('proxyquire');

const fakeArgv = { 'skip-bar': true };
const skip = proxyquire('../../../lib/plugins/groupTasks/skip', {
  '../../argv': fakeArgv,
});
const STATE_SKIP = false;
const STATE_DO_NOT_SKIP = true;

describe('skipFactory', () => {
  it('returns a skip function', () => {
    expect(typeof skip('foo')).toBe('function');
  });
});

describe('skip', () => {
  it('does not skip non-matching tasks', () => {
    const task = {
      displayName: 'bar:foo',
    };

    expect(skip('bar')(task)).toBe(STATE_DO_NOT_SKIP);
  });

  it('does not skip tasks with non-matching subcategory', () => {
    const task = {
      displayName: 'foo:lorem:bar',
    };

    expect(skip('foo')(task)).toBe(STATE_DO_NOT_SKIP);
  });

  it('does not skip tasks with non-matching basename', () => {
    const task = {
      displayName: 'foo:bar',
    };

    expect(skip('lorem')(task)).toBe(STATE_DO_NOT_SKIP);
  });

  it('does not skip non-matching tasks of subcategory', () => {
    fakeArgv['skip-foo:lorem'] = true;

    const task = {
      displayName: 'foo:foo:ipsum',
    };

    expect(skip('foo')(task)).toBe(STATE_DO_NOT_SKIP);
  });

  it('skips matching tasks', () => {
    const task = {
      displayName: 'foo:bar',
    };

    expect(skip('foo')(task)).toBe(STATE_SKIP);
  });

  it('skips tasks matching by subcategory', () => {
    const task = {
      displayName: 'foo:bar:lorem',
    };

    expect(skip('foo')(task)).toBe(STATE_SKIP);
  });

  it('skips tasks matching by subcategory and taskname', () => {
    fakeArgv['skip-foo:lorem'] = true;

    const task = {
      displayName: 'foo:foo:lorem',
    };

    expect(skip('foo')(task)).toBe(STATE_SKIP);
  });
});
