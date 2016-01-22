'use strict';

const logger = require('gulplog');

module.exports = function watch(task, store) {
  if (!store.getRelatedFiles[task.displayName]) {
    return task;
  }

  const relatedFiles = store.getRelatedFiles[task.displayName]();

  if (!relatedFiles.length) {
    return task;
  }

  return () => {
    const taskWithWaitingLog = store.gulp.series([
      task,
      (done) => {
        logger.info('waiting for changes...');
        done();
      }
    ]);

    taskWithWaitingLog();
    return store.gulp.watch(
      relatedFiles,
      taskWithWaitingLog
    );
  };
};
