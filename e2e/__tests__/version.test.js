/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

'use strict';

import path from 'path';
import os from 'os';
import {cleanup, writeFiles} from '../Utils';
import runJest from '../runJest';

const DIR = path.resolve(os.tmpdir(), 'version_test');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('works with jest.config.js', () => {
  writeFiles(DIR, {
    '.watchmanconfig': '',
    'package.json': '{}',
  });

  const {status, stdout, stderr} = runJest(DIR, ['--version']);
  expect(stdout).toMatch(/\d{2}\.\d{1,2}\.\d{1,2}[\-\S]*$/);
  // Only version gets printed and nothing else
  expect(stdout.split(/\n/)).toHaveLength(1);
  expect(stderr).toBe('');
  expect(status).toBe(0);
});
