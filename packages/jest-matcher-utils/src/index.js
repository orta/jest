/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import chalk from 'chalk';
import getType from 'jest-get-type';
import prettyFormat from 'pretty-format';
const {
  AsymmetricMatcher,
  DOMCollection,
  DOMElement,
  Immutable,
  ReactElement,
  ReactTestComponent,
} = prettyFormat.plugins;

const PLUGINS = [
  ReactTestComponent,
  ReactElement,
  DOMElement,
  DOMCollection,
  Immutable,
  AsymmetricMatcher,
];

export const EXPECTED_COLOR = chalk.green;
export const RECEIVED_COLOR = chalk.red;

const NUMBERS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
];

export const SUGGEST_TO_EQUAL = chalk.dim(
  'Note that you are testing for equality with the stricter `toBe` matcher using `Object.is`. For deep equality only, use `toEqual` instead.',
);

export const SUGGEST_TO_CONTAIN_EQUAL = chalk.dim(
  'Looks like you wanted to test for object/array equality with the stricter `toContain` matcher. You probably need to use `toContainEqual` instead.',
);

export const stringify = (object: any, maxDepth?: number = 10): string => {
  const MAX_LENGTH = 10000;
  let result;

  try {
    result = prettyFormat(object, {
      maxDepth,
      min: true,
      plugins: PLUGINS,
    });
  } catch (e) {
    result = prettyFormat(object, {
      callToJSON: false,
      maxDepth,
      min: true,
      plugins: PLUGINS,
    });
  }

  return result.length >= MAX_LENGTH && maxDepth > 1
    ? stringify(object, Math.floor(maxDepth / 2))
    : result;
};

export const highlightTrailingWhitespace = (text: string): string =>
  text.replace(/\s+$/gm, chalk.inverse('$&'));

export const printReceived = (object: any) =>
  RECEIVED_COLOR(highlightTrailingWhitespace(stringify(object)));
export const printExpected = (value: any) =>
  EXPECTED_COLOR(highlightTrailingWhitespace(stringify(value)));

export const printWithType = (
  name: string, // 'Expected' or 'Received'
  value: any,
  print: (value: any) => string, // printExpected or printReceived
) => {
  const type = getType(value);
  const hasType =
    type !== 'null' && type !== 'undefined'
      ? `${name} has type:  ${type}\n`
      : '';
  const hasValue = `${name} has value: ${print(value)}`;
  return hasType + hasValue;
};

export const ensureNoExpected = (expected: any, matcherName: string) => {
  matcherName || (matcherName = 'This');
  if (typeof expected !== 'undefined') {
    throw new Error(
      matcherErrorMessage(
        matcherHint('[.not]' + matcherName, undefined, ''),
        `${EXPECTED_COLOR('expected')} value must be omitted or undefined`,
        printWithType('Expected', expected, printExpected),
      ),
    );
  }
};

export const ensureActualIsNumber = (actual: any, matcherName: string) => {
  matcherName || (matcherName = 'This matcher');
  if (typeof actual !== 'number') {
    throw new Error(
      matcherErrorMessage(
        matcherHint('[.not]' + matcherName),
        `${RECEIVED_COLOR('received')} value must be a number`,
        printWithType('Received', actual, printReceived),
      ),
    );
  }
};

export const ensureExpectedIsNumber = (expected: any, matcherName: string) => {
  matcherName || (matcherName = 'This matcher');
  if (typeof expected !== 'number') {
    throw new Error(
      matcherErrorMessage(
        matcherHint('[.not]' + matcherName),
        `${EXPECTED_COLOR('expected')} value must be a number`,
        printWithType('Expected', expected, printExpected),
      ),
    );
  }
};

export const ensureNumbers = (
  actual: any,
  expected: any,
  matcherName: string,
) => {
  ensureActualIsNumber(actual, matcherName);
  ensureExpectedIsNumber(expected, matcherName);
};

export const pluralize = (word: string, count: number) =>
  (NUMBERS[count] || count) + ' ' + word + (count === 1 ? '' : 's');

// To display lines of labeled values as two columns with monospace alignment:
// given the strings which will describe the values,
// return function which given each string, returns the label:
// string, colon, space, and enough padding spaces to align the value.

type PrintLabel = string => string;

export const getLabelPrinter = (...strings: Array<string>): PrintLabel => {
  const maxLength = strings.reduce(
    (max, string) => (string.length > max ? string.length : max),
    0,
  );
  return string => `${string}: ${' '.repeat(maxLength - string.length)}`;
};

export const matcherErrorMessage = (
  hint: string, // assertion returned from call to matcherHint
  generic: string, // condition which correct value must fulfill
  specific: string, // incorrect value returned from call to printWithType
) => `${hint}\n\n${chalk.bold('Matcher error')}: ${generic}\n\n${specific}`;

export const matcherHint = (
  matcherName: string,
  received: string = 'received',
  expected: string = 'expected',
  options: {
    comment?: string,
    isDirectExpectCall?: boolean,
    isNot?: boolean,
    secondArgument?: ?string,
  } = {},
) => {
  const {comment, isDirectExpectCall, isNot, secondArgument} = options;
  return (
    chalk.dim('expect' + (isDirectExpectCall ? '' : '(')) +
    RECEIVED_COLOR(received) +
    (isNot
      ? `${chalk.dim(').')}not${chalk.dim(matcherName + '(')}`
      : chalk.dim((isDirectExpectCall ? '' : ')') + matcherName + '(')) +
    EXPECTED_COLOR(expected) +
    (secondArgument
      ? `${chalk.dim(', ')}${EXPECTED_COLOR(secondArgument)}`
      : '') +
    chalk.dim(`)${comment ? ` // ${comment}` : ''}`)
  );
};
