'use strict';

var gulp = require('gulp');
var GulpToolboxRegistry = require('./index');
var testNodeJasmine = require('gulp-toolbox-test-node-jasmine');
var pipeCoverageIstanbul = require('gulp-toolbox-pipe-coverage-istanbul');

gulp.registry(new GulpToolboxRegistry({
  toolboxes: [
    testNodeJasmine
  ],
  pipes: [
    pipeCoverageIstanbul
  ],
  config: {
    files: {
      test: {
        node: {
          specs: ['test/**/*Spec.js']
        }
      }
    }
  }
}));
