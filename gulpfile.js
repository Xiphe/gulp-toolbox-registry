/* eslint-disable import/no-extraneous-dependencies */

'use strict';

const gulp = require('gulp');
const GulpToolboxRegistry = require('./index');
const testNodeJasmine = require('gulp-toolbox-test-node-jasmine');
const pipeCoverageIstanbul = require('gulp-toolbox-pipe-coverage-istanbul');
const reporterCoverage = require('gulp-toolbox-reporter-coveralls');

gulp.registry(new GulpToolboxRegistry({
  toolboxes: [
    testNodeJasmine,
    reporterCoverage,
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
