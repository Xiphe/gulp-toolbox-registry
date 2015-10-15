'use strict';

module.exports = function(gulp) {
  var hooks = {};
  var hiddenAffixes = ['pre', 'post'];

  return {
    add: function(name, task) {
      if (!hooks[name]) {
        var show = hiddenAffixes.indexOf(name.split('-')[0]) === -1;
        hooks[name] = [];
        gulp.task(name, show, hooks[name]);
      }

      hooks[name].push(task);
    }
  };
};
