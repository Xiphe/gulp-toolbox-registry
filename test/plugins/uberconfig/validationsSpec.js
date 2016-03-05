'use strict';

const validations = require('../../../lib/plugins/uberconfig/validations');

function applyValidations(toolbox) {
  validations.forEach((validation) => {
    validation(toolbox);
  });
}

describe('validations', () => {
  let validToolbox = null;

  beforeEach(() => {
    validToolbox = {
      meta: {
        name: 'foo',
        bugs: 'none',
      },
    };
  });

  it('are an array of functions', () => {
    expect(validations instanceof Array).toBe(true);
    expect(typeof validations[0]).toBe('function');
  });

  it('pass with valid toolbox', () => {
    expect(() => applyValidations(validToolbox)).not.toThrow();
  });

  it('fail when toolbox does not have a meta property', () => {
    delete validToolbox.meta;
    expect(() => applyValidations(validToolbox)).toThrow();
  });

  it('fail when toolbox does not have a meta.name property', () => {
    delete validToolbox.meta.name;
    expect(() => applyValidations(validToolbox)).toThrow();
  });

  it('fail when toolbox does not have a meta.bugs property', () => {
    delete validToolbox.meta.bugs;
    expect(() => applyValidations(validToolbox)).toThrow();
  });

  it('fail when toolbox meta.bugs property is not a string', () => {
    validToolbox.meta.bugs = {};
    expect(() => applyValidations(validToolbox)).toThrow();
  });

  it('fail when toolbox meta.bugs.url property is not a string', () => {
    validToolbox.meta.bugs = { url: 70 };
    expect(() => applyValidations(validToolbox)).toThrow();
  });

  it('pass when toolbox meta.bugs.url property is a string', () => {
    validToolbox.meta.bugs = { url: 'here' };
    expect(() => applyValidations(validToolbox)).not.toThrow();
  });
});
