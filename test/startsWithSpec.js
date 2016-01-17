'use strict';

var startsWith = require('../lib/startsWith');

describe('startsWith', () => {
  it('returns a filter for displayNames', () => {
    const nameStart = 'foo';
    const filter = startsWith(nameStart);
    const okFixture = {displayName: `${nameStart}bar`};
    const notOkFixture = {displayName: 'barfoo'};

    const result = [notOkFixture, okFixture].filter(filter);

    expect(result).toContain(okFixture);
    expect(result).not.toContain(notOkFixture);
  });
});
