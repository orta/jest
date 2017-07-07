/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const skipOnWindows = require('skipOnWindows');
const {extractSummary} = require('../utils');
const runJest = require('../runJest');

describe('Custom Reporters Integration', () => {
  skipOnWindows.suite();

  test('valid string format for adding reporters', () => {
    const reporterConfig = {
      reporters: ['<rootDir>/reporters/test_reporter.js'],
    };

    const {status} = runJest('custom_reporters', [
      '--config',
      JSON.stringify(reporterConfig),
      'add.test.js',
    ]);

    expect(status).toBe(0);
  });

  test('valid array format for adding reporters', () => {
    const reporterConfig = {
      reporters: [
        [
          '<rootDir>/reporters/test_reporter.js',
          {'Dmitrii Abramov': 'Awesome'},
        ],
      ],
    };

    const {status} = runJest('custom_reporters', [
      '--config',
      JSON.stringify(reporterConfig),
      'add.test.js',
    ]);

    expect(status).toBe(0);
  });

  test('invalid format for adding reporters', () => {
    const reporterConfig = {
      reporters: [[3243242]],
    };

    const {status, stderr} = runJest('custom_reporters', [
      '--config',
      JSON.stringify(reporterConfig),
      'add.test.js',
    ]);

    expect(status).toBe(1);
    expect(stderr).toMatchSnapshot();
  });

  test('default reporters enabled', () => {
    const {stderr, stdout, status} = runJest('custom_reporters', [
      '--config',
      JSON.stringify({
        reporters: ['default', '<rootDir>/reporters/test_reporter.js'],
      }),
      'add.test.js',
    ]);

    const {summary, rest} = extractSummary(stderr);
    const parsedJSON = JSON.parse(stdout);

    expect(status).toBe(0);
    expect(rest).toMatchSnapshot();
    expect(summary).toMatchSnapshot();
    expect(parsedJSON).toMatchSnapshot();
  });

  test('TestReporter with all tests passing', () => {
    const {stdout, status, stderr} = runJest('custom_reporters', [
      'add.test.js',
    ]);

    const parsedJSON = JSON.parse(stdout);

    expect(status).toBe(0);
    expect(stderr.trim()).toBe('');
    expect(parsedJSON).toMatchSnapshot();
  });

  test('TestReporter with all tests failing', () => {
    const {stdout, status, stderr} = runJest('custom_reporters', [
      'add_fail.test.js',
    ]);

    const parsedJSON = JSON.parse(stdout);

    expect(status).toBe(1);
    expect(stderr.trim()).toBe('');
    expect(parsedJSON).toMatchSnapshot();
  });

  test('IncompleteReporter for flexibility', () => {
    const {stderr, stdout, status} = runJest('custom_reporters', [
      '--no-cache',
      '--config',
      JSON.stringify({
        reporters: ['<rootDir>/reporters/incomplete_reporter.js'],
      }),
      'add.test.js',
    ]);

    expect(status).toBe(0);
    expect(stderr.trim()).toBe('');

    expect(stdout).toMatchSnapshot();
  });
});
