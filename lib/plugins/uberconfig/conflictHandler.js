'use strict';

const path = require('path');

function decorateMeta(meta, target) {
  target.meta = meta;
  return target;
}

module.exports = function conflictHandlerFactory(meta) {
  function getConflictError(defaultValue, otherDefaults, key) {
    const errTitle = `conflicting default values for config key "${key}"`;
    const defaults = otherDefaults.map((currentDefault) => {
      try {
        currentDefault.conflictResolver({}, [], key);
      } catch (error) {
        if (!error.meta) {
          throw error;
        }

        return {
          meta: error.meta,
          defaultValue: currentDefault.defaultValue
        };
      }
    }).concat([{meta, defaultValue}]);

    const inErrorList = defaults.map((currentDefault) => {
      return ` - :quote;${JSON.stringify(currentDefault.defaultValue)}:quote;` +
       `: ${currentDefault.meta.name}`;
    }).join('\n');

    const nofityList = defaults.map((currentDefault) => {
      return ` - ${JSON.stringify(currentDefault.meta.name)}` +
       `: ${path.join(currentDefault.meta.bugs, 'new')}` +
       `?title=${encodeURIComponent(errTitle)}` +
       `&body=${encodeURIComponent(inErrorList.replace(/:quote;/g, '`'))}`;
    }).join('\n');

    return decorateMeta(
      meta,
      new Error(
        `${errTitle}\n${inErrorList.replace(/:quote;/g, '')}\n\n` +
        `Please notify the authors:\n${nofityList}\n\n`
      )
    );
  }

  return (currentDefault, defaultsMap, key) => {
    throw getConflictError(
      currentDefault.defaultValue,
      defaultsMap,
      key
    );
  };
};
