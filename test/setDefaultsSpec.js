describe('#setDefaults', function() {
  'use strict';

  var path = require('path');
  var findup = require('findup');
  var gutil = require('gulp-util');
  var constants = require('../lib/contants');
  var setDefaults = require('../lib/setDefaults');
  var config;

  beforeEach(function() {
    config = {};
  });

  it('should set the basePath based on package.json', function() {
    setDefaults(config);
    expect(config.basePath).toBe(path.resolve(__dirname, '..'));
  });

  it('should log error and exit process if findup fails', function() {
    var basePath = setDefaults({}).basePath;
    spyOn(findup, 'sync').and.throwError();
    spyOn(gutil, 'log');
    spyOn(process, 'exit');
    spyOn(path, 'join').and.returnValue(basePath);
    setDefaults(config);
    expect(gutil.log).toHaveBeenCalledWith(
      gutil.colors.red(constants.ERROR_NO_PACKAGE_JSON_FOUND)
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should load the package.json', function() {
    var fixturePackage = path.resolve(__dirname, 'fixtures/package.json');
    spyOn(path, 'join').and.returnValue(fixturePackage);
    setDefaults(config);
    expect(config.pkg).toEqual({foo: 'bar'});
  });
});
