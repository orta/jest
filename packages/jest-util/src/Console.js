/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
/* global stream$Writable */
'use strict';

import type {LogType, LogMessage} from 'types/Console';

const {format} = require('util');
const {Console} = require('console');

const clearLine = require('./clearLine');

type Formatter = (type: LogType, message: LogMessage) => string;

class CustomConsole extends Console {
  _stdout: stream$Writable;
  _formatBuffer: Formatter;

  constructor(
    stdout: stream$Writable,
    stderr: stream$Writable,
    formatBuffer: ?Formatter,
  ) {
    super(stdout, stderr);
    this._formatBuffer = formatBuffer || ((type, message) => message);
  }

  _log(type: LogType, message: string) {
    clearLine(this._stdout);
    super.log(this._formatBuffer(type, message));
  }

  log() {
    this._log('log', format.apply(null, arguments));
  }

  info() {
    this._log('info', format.apply(null, arguments));
  }

  warn() {
    this._log('warn', format.apply(null, arguments));
  }

  error() {
    this._log('error', format.apply(null, arguments));
  }

  getBuffer() {
    return null;
  }
}

module.exports = CustomConsole;
