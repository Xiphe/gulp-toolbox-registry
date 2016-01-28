'use strict';

var gulp = require('gulp');
var GulpToolboxRegistry = require('./index');
var testNodeJasmine = require('gulp-toolbox-test-node-jasmine');
// var optionalCoverageIstanbul = require(
//   'gulp-toolbox-optional-coverage-istanbul'
// );

gulp.registry(new GulpToolboxRegistry({
  toolboxes: [
    testNodeJasmine
    // optionalCoverageIstanbul
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
