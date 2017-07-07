/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import pTimeout from './p_timeout';

type Options = {
  clearTimeout: (timeoutID: number) => void,
  fail: () => void,
  onException: (error: Error) => void,
  queueableFns: Array<QueueableFn>,
  setTimeout: (func: () => void, delay: number) => number,
  userContext: any,
};

type QueueableFn = {
  fn: (next: () => void) => void,
  timeout?: () => number,
};

async function queueRunner(options: Options) {
  const mapper = ({fn, timeout}) => {
    const promise = new Promise(resolve => {
      const next = () => resolve();
      next.fail = function() {
        options.fail.apply(null, arguments);
        resolve();
      };
      try {
        fn.call(options.userContext, next);
      } catch (e) {
        options.onException(e);
        resolve();
      }
    });
    if (!timeout) {
      return promise;
    }
    return pTimeout(
      promise,
      timeout(),
      options.clearTimeout,
      options.setTimeout,
      () => {
        const error = new Error(
          'Timeout - Async callback was not invoked within timeout specified ' +
            'by jasmine.DEFAULT_TIMEOUT_INTERVAL.',
        );
        options.onException(error);
      },
    );
  };

  return options.queueableFns.reduce(
    (promise, fn) => promise.then(() => mapper(fn)),
    Promise.resolve(),
  );
}

module.exports = queueRunner;
