'use strict';

module.exports = [
  (toolbox) => {
    if (!toolbox.meta) {
      throw new Error('toolbox <undefined> does not provide any meta data');
    }
  },
  (toolbox) => {
    if (!toolbox.meta.name || typeof toolbox.meta.name !== 'string') {
      throw new Error('toolbox <undefined> does not provide required "name"' +
        'in it\'s meta data');
    }
  },
  (toolbox) => {
    if (!toolbox.meta.bugs ||
      (typeof toolbox.meta.bugs !== 'string' &&
      typeof toolbox.meta.bugs.url !== 'string')
    ) {
      throw new Error(`toolbox ${toolbox.meta.name} does not provide ` +
        'required "bugs" url in it\'s meta data.');
    }
  },
];
