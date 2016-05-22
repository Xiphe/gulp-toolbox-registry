'use strict';

const pluginMetaDescription = require('../../lib/plugins/pluginMetaDescription');
const errorMatching = require('../helper/errorMatching');

describe('pluginMetaDescription', () => {
  describe('#validate', () => {
    it('throws when there is no description on toolbox.meta', () => {
      expect(() => {
        pluginMetaDescription.validate({ meta: { } });
      }).toThrow(errorMatching('missing required "description" in it\'s meta data'));
    });

    it('does not throw if there is a valid description', () => {
      expect(() => {
        pluginMetaDescription.validate({ meta: { description: 'foo' } });
      }).not.toThrow();
    });
  });

  describe('#decorateTask', () => {
    it('decorates the description to task', () => {
      const description = Symbol('foo');
      const myTask = { provider: { meta: { description } } };

      pluginMetaDescription.decorateTask(myTask);

      expect(myTask.description).toBe(description);
    });
  });
});
