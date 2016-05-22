'use strict';

const proxyquire = require('proxyquire');

describe('GulpToolboxRegistry', () => {
  it('is a wrapper around undertaker-task-provider-registry', () => {
    const FakeTaskProviderRegistry = jasmine.createSpy('TaskProviderRegistry');
    const GulpToolboxRegistry = proxyquire(
      '../lib/GulpToolboxRegistry',
      {
        'undertaker-task-provider-registry': FakeTaskProviderRegistry,
      }
    );
    const someToolboxes = Symbol('toolboxes');

    new GulpToolboxRegistry({ toolboxes: someToolboxes }); // eslint-disable-line no-new

    expect(FakeTaskProviderRegistry).toHaveBeenCalledWith(jasmine.objectContaining({
      providers: someToolboxes,
      plugins: jasmine.any(Array),
    }));
  });
});
