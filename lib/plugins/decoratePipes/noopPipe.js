'use strict';

const through2 = require('through2');

module.exports = through2.obj(
  (chunk, __, cb) => cb(null, chunk),
  cb => cb()
);
