/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails oncall+jsinfra
 */

/* eslint-disable import/no-unresolved */

import {Color} from '../types';
import {color} from '../entry';

jest.mock('../entry', () => {
  const color: Color = 'blue';
  return {color};
});

describe('babel-plugin-jest-hoist', () => {
  it('works even with type imports', () => {
    expect(color).toBe('blue');
  });
});
