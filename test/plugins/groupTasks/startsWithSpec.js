'use strict';

const startsWith = require('../../../lib/plugins/groupTasks/startsWith');

describe('startsWithFactory', () => {
  it('returns a startsWith function', () => {
    expect(typeof startsWith('foo')).toBe('function');
  });
});

describe('startsWith', () => {
  it('filters a list based on displayName', () => {
    const nameStart = 'foo';
    const filter = startsWith(nameStart);
    const okFixture = { displayName: `${nameStart}bar` };
    const notOkFixture = { displayName: 'barfoo' };

    const result = [notOkFixture, okFixture].filter(filter);

    expect(result).toContain(okFixture);
    expect(result).not.toContain(notOkFixture);
  });

  it('filters a list based on name', () => {
    const nameStart = 'foo';
    const filter = startsWith(nameStart);
    const okFixture = { name: `${nameStart}bar` };
    const notOkFixture = { name: 'barfoo' };

    const result = [notOkFixture, okFixture].filter(filter);

    expect(result).toContain(okFixture);
    expect(result).not.toContain(notOkFixture);
  });
});
