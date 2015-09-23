/* jshint jasmine: true */
describe('#validateConfig', function() {
  'use strict';

  var validateConfig = require('../lib/validateConfig');
  var validConfig = null;

  beforeEach(function() {
    validConfig = {
      gulp: require('gulp')
    };
  });

  it('should not throw when config is valid', function() {
    expect(function() {
      validateConfig(validConfig);
    }).not.toThrow();
  });

  it('should throw when config has no gulp key', function() {
    var invalidConfig = validConfig;
    delete invalidConfig.gulp;

    expect(function() {
      validateConfig(invalidConfig);
    }).toThrow();
  });
});
