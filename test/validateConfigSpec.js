'use strict';

var validateConfig = require('../lib/validateConfig');
var gulp = require('gulp');

describe('#validateConfig', () => {
  var validConfig = null;

  beforeEach(() => {
    validConfig = {
      gulp
    };
  });

  it('should not throw when config is valid', () => {
    expect(() => {
      validateConfig(validConfig);
    }).not.toThrow();
  });

  it('should throw when config has no gulp key', () => {
    var invalidConfig = validConfig;

    delete invalidConfig.gulp;

    expect(() => {
      validateConfig(invalidConfig);
    }).toThrow();
  });
});
