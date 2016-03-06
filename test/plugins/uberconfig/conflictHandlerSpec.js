'use strict';

const conflictHandlerFactory = require('../../../lib/plugins/uberconfig/conflictHandler');

describe('conflictHandler factory', () => {
  it('returns a conflictHandler function', () => {
    expect(typeof conflictHandlerFactory()).toBe('function');
  });
});

function normalizeMessage(string) {
  return string.replace(/\s/g, '');
}

describe('conflictHandler', () => {
  it('passes errors that have not been decorated', () => {
    const undecoratedError = new Error('foo');
    const otherDefaults = [{
      defaultValue: 'igel',
      conflictResolver: jasmine.createSpy().and.throwError(
        undecoratedError
      ),
    }];

    expect(() => {
      conflictHandlerFactory({})('hase', otherDefaults, 'lorem.ipsum');
    }).toThrow(undecoratedError);
  });

  it('throws an error with links to create issues on conflicting toolboxes', () => {
    const meta = {
      name: 'make-some-foo',
      bugs: 'http://example.org/foobugs',
    };
    const decoratedError = new Error('foo');
    decoratedError.meta = {
      name: 'be-really-bar',
      bugs: 'http://example.org/barbugs',
    };
    const defaultValue = 'hase';
    const otherDefaultValue = 'igel';
    const someConfigKey = 'lorem.ipsum';
    const otherDefaults = [{
      defaultValue: otherDefaultValue,
      conflictResolver: jasmine.createSpy().and.throwError(
        decoratedError
      ),
    }, {
      defaultValue: 'fuchs',
      conflictResolver() {},
    }];
    const expectedErrorMessage = `
      conflicting default values for config key "${someConfigKey}"
       - "${otherDefaultValue}": ${decoratedError.meta.name}
       - "${defaultValue}": ${meta.name}

      Please notify the authors:
       - "${decoratedError.meta.name}":
                ${decoratedError.meta.bugs}/new?title=conflicting%20default%20
                values%20for%20config%20key%20%22${someConfigKey}%22&body=%20-%20
                %60%22${otherDefaultValue}%22%60%3A%20${decoratedError.meta.name}
                %0A%20-%20%60%22${defaultValue}%22%60%3A%20${meta.name}
       - "${meta.name}":
                ${meta.bugs}/new?title=conflicting%20default%20
                values%20for%20config%20key%20%22${someConfigKey}%22&body=%20-%20
                %60%22${otherDefaultValue}%22%60%3A%20${decoratedError.meta.name}
                %0A%20-%20%60%22${defaultValue}%22%60%3A%20${meta.name}
    `;

    let conflictError = null;

    try {
      conflictHandlerFactory(meta)({ defaultValue }, otherDefaults, someConfigKey);
    } catch (err) {
      conflictError = err;
    }

    expect(conflictError instanceof Error).toBe(true);
    expect(normalizeMessage(conflictError.message))
      .toBe(normalizeMessage(expectedErrorMessage));
  });
});
