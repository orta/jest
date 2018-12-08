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
import runJest from '../runJest';
import {cleanup, extractSummary, writeFiles} from '../Utils';

const DIR = path.resolve(__dirname, '../resolve_no_extensions-no-js');

beforeEach(() => cleanup(DIR));
afterAll(() => cleanup(DIR));

test('show error message with matching files', () => {
  const {status, stderr} = runJest('resolve_no_extensions');
  const {rest} = extractSummary(stderr);

  expect(status).toBe(1);
  expect(rest).toMatchSnapshot();
});

test('show error message when no js moduleFileExtensions', () => {
  writeFiles(DIR, {
    'index.jsx': `
      module.exports ={found: true};
    `,
    'package.json': `
      {
        "jest": {
          "moduleFileExtensions": ["jsx"]
        }
      }
    `,
    'test.jsx': `
      const m = require('../');

      test('some test', () => {
        expect(m.found).toBe(true);
      });
    `,
  });

  const {status, stderr} = runJest('resolve_no_extensions-no-js');

  expect(status).toBe(1);
  expect(stderr).toMatchSnapshot();
});
