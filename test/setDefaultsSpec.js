'use strict';

var path = require('path');
var findup = require('findup');
var chalk = require('chalk');
var logger = require('gulplog');
var constants = require('../lib/contants');
var setDefaults = require('../lib/setDefaults');

describe('#setDefaults', () => {
  var config = null;

  beforeEach(() => {
    config = {};
  });

  it('should set the basePath based on package.json', () => {
    setDefaults(config);
    expect(config.basePath).toBe(path.resolve(__dirname, '..'));
  });

  it('should log error and exit process if findup fails', () => {
    var basePath = setDefaults({}).basePath;

    spyOn(findup, 'sync').and.throwError();
    spyOn(process, 'exit');
    spyOn(logger, 'error');
    spyOn(path, 'join').and.returnValue(basePath);
    setDefaults(config);
    expect(logger.error).toHaveBeenCalledWith(
      chalk.red(constants.ERROR.NO_PACKAGE_JSON_FOUND)
    );
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('should load the package.json', () => {
    var fixturePackage = path.resolve(__dirname, 'fixtures/package.json');

    spyOn(path, 'join').and.returnValue(fixturePackage);
    setDefaults(config);
    expect(config.pkg).toEqual({foo: 'bar'});
  });
});
