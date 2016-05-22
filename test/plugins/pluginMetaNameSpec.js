'use strict';

const pluginMetaName = require('../../lib/plugins/pluginMetaName');
const errorMatching = require('../helper/errorMatching');

describe('pluginMetaName', () => {
  describe('#validate', () => {
    it('throws when there is no name on meta', () => {
      expect(() => {
        pluginMetaName.validate({ meta: {} });
      }).toThrow(errorMatching('does not provide required "name" in it\'s meta data'));
    });

    it('does not throw when there is a name', () => {
      expect(() => {
        pluginMetaName.validate({ meta: { name: 'foo' } });
      }).not.toThrow();
    });
  });

  describe('#decorateTask', () => {
    it('decorates the task with a displayName', () => {
      const name = 'foo';
      const task = pluginMetaName.decorateTask({ provider: { meta: { name } } });

      expect(task.displayName).toBe(name);
    });

    it('strips "gulp-toolbox-" and converts dashes to colons', () => {
      const name = 'gulp-toolbox-foo-bar';
      const task = pluginMetaName.decorateTask({ provider: { meta: { name } } });

      expect(task.displayName).toBe('foo:bar');
    });
  });
});
