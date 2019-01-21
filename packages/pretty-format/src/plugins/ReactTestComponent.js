/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {
  Config,
  Printer,
  NewPlugin,
  ReactTestObject,
  Refs,
} from 'types/PrettyFormat';

import {
  printChildren,
  printElement,
  printElementAsLeaf,
  printProps,
} from './lib/markup';

const testSymbol = Symbol.for('react.test.json');

const getPropKeys = object => {
  const {props} = object;

  return props
    ? Object.keys(props)
        .filter(key => props[key] !== undefined)
        .sort()
    : [];
};

export const serialize = (
  object: ReactTestObject,
  config: Config,
  indentation: string,
  depth: number,
  refs: Refs,
  printer: Printer,
): string =>
  ++depth > config.maxDepth
    ? printElementAsLeaf(object.type, config)
    : printElement(
        object.type,
        object.props
          ? printProps(
              getPropKeys(object),
              object.props,
              config,
              indentation + config.indent,
              depth,
              refs,
              printer,
            )
          : '',
        object.children
          ? printChildren(
              object.children,
              config,
              indentation + config.indent,
              depth,
              refs,
              printer,
            )
          : '',
        config,
        indentation,
      );

export const test = (val: any) => val && val.$$typeof === testSymbol;

export default ({serialize, test}: NewPlugin);
