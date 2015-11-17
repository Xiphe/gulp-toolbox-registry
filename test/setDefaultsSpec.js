'use strict';

var path = require('path');
var setDefaults = require('../lib/setDefaults');

describe('#setDefaults', () => {
  var config = null;

  beforeEach(() => {
    config = {};
  });

  it('should load the package.json', () => {
    var fixturePackage = path.resolve(__dirname, 'fixtures/package.json');

    spyOn(path, 'join').and.returnValue(fixturePackage);
    setDefaults(config);
    expect(config.pkg).toEqual({foo: 'bar'});
  });
});
