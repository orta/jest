/**
 * Copyright (c) 2018-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export default class ErrorWithStack extends Error {
  constructor(message: ?string, callsite: Function) {
    super(message);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, callsite);
    }
  }
}
