'use strict';

const gulp = require('gulp');
const GulpToolboxRegistry = require('./index');
const testNodeJasmine = require('gulp-toolbox-test-node-jasmine');
const pipeCoverageIstanbul = require('gulp-toolbox-pipe-coverage-istanbul');

gulp.registry(new GulpToolboxRegistry({
  toolboxes: [
    testNodeJasmine,
  ],
  pipes: [
    pipeCoverageIstanbul,
  ],
  config: {
    files: {
      test: {
        node: {
          specs: ['test/**/*Spec.js'],
        },
      },
    },
  },
}));
