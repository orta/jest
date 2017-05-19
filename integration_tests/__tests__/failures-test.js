/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

'use strict';

const path = require('path');
const skipOnWindows = require('skipOnWindows');
const {extractSummary} = require('../utils');
const runJest = require('../runJest');

const dir = path.resolve(__dirname, '../failures');

skipOnWindows.suite();

// Some node versions add an extra line to the error stack trace. This makes
// snapshot tests fail on different machines. This function makes sure
// this extra line is always removed.
const stripInconsistentStackLines = summary => {
  summary.rest = summary.rest
    .replace(/\n^.*process\._tickCallback.*$/gm, '')
    .replace(/\n^.*_throws.*$/gm, '')
    .replace(/\n^.*Function\..*(throws|doesNotThrow).*$/gm, '')
    .replace(/\n^.*setup-jest-globals\.js.*$/gm, '')
    .replace(/(\n^.*Object.<anonymous>)\.test(.*$)/gm, '$1$2');
  return summary;
};

test('not throwing Error objects', () => {
  let stderr;
  stderr = runJest(dir, ['throw-number-test.js']).stderr;
  expect(stripInconsistentStackLines(extractSummary(stderr))).toMatchSnapshot();
  stderr = runJest(dir, ['throw-string-test.js']).stderr;
  expect(stripInconsistentStackLines(extractSummary(stderr))).toMatchSnapshot();
  stderr = runJest(dir, ['throw-object-test.js']).stderr;
  expect(stripInconsistentStackLines(extractSummary(stderr))).toMatchSnapshot();
  stderr = runJest(dir, ['assertion-count-test.js']).stderr;
  expect(stripInconsistentStackLines(extractSummary(stderr))).toMatchSnapshot();
});

test('works with node assert', () => {
  const {stderr} = runJest(dir, ['node-assertion-error-test.js']);
  expect(stripInconsistentStackLines(extractSummary(stderr))).toMatchSnapshot();
});
