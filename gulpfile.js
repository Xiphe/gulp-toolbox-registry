'use strict';

var gulp = require('gulp');
var gulpToolbox = require('./index');

gulpToolbox({
  gulp,
  files: {
    test: {
      node: {
        specs: ['test/**/*Spec.js']
      }
    }
  }
});
