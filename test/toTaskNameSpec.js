'use strict';

var toTaskName = require('../lib/toTaskName');
var CONSTANTS = require('../lib/contants');

describe('toTaskName', () => {
  it('converts hyphens to colons', () => {
    expect(toTaskName('foo-bar')).toBe('foo:bar');
  });

  it('strips gulp-toolbox', () => {
    expect(toTaskName(`${CONSTANTS.TOOLBOX_PREFIX}foo`)).toBe('foo');
  });
});
