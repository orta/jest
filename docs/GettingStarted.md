---
id: getting-started
title: Getting Started
---

Install Jest using [`yarn`](https://yarnpkg.com/en/package/jest):

```bash
yarn add --dev jest
```

Or [`npm`](https://www.npmjs.com/):

```bash
npm install --save-dev jest
```

Note: Jest documentation uses `yarn` commands, but `npm` will also work. You can compare `yarn` and `npm` commands in the [yarn docs, here](https://yarnpkg.com/en/docs/migrating-from-npm#toc-cli-commands-comparison).

Let's get started by writing a test for a hypothetical function that adds two numbers. First, create a `sum.js` file:

```javascript
function sum(a, b) {
  return a + b;
}
module.exports = sum;
```

Then, create a file named `sum.test.js`. This will contain our actual test:

```javascript
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
```

Add the following section to your `package.json`:

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

Finally, run `yarn test` or `npm run test` and Jest will print this message:

```bash
PASS  ./sum.test.js
✓ adds 1 + 2 to equal 3 (5ms)
```

**You just successfully wrote your first test using Jest!**

This test used `expect` and `toBe` to test that two values were exactly identical. To learn about the other things that Jest can test, see [Using Matchers](UsingMatchers.md).

## Running from command line

You can run Jest directly from the CLI (if it's globally available in your `PATH`, e.g. by `yarn global add jest` or `npm install jest --global`) with a variety of useful options.

Here's how to run Jest on files matching `my-test`, using `config.json` as a configuration file and display a native OS notification after the run:

```bash
jest my-test --notify --config=config.json
```

If you'd like to learn more about running `jest` through the command line, take a look at the [Jest CLI Options](CLI.md) page.

## Additional Configuration

### Generate a basic configuration file

Based on your project, Jest will ask you a few questions and will create a basic configuration file with a short description for each option:

```bash
jest --init
```

### Using Babel

To use [Babel](http://babeljs.io/), install the `babel-jest` and `@babel/core` packages via `yarn`:

```bash
yarn add --dev babel-jest @babel/core
```

Don't forget to add a [`babel.config.js`](https://babeljs.io/docs/en/config-files) file in your project's root folder. For example, if you are using ES6 and [React.js](https://reactjs.org) with the [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env) and [`@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react) presets:

```js
module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
};
```

You are now set up to use all ES6 features and React specific syntax.

```json
{
  "presets": [["env", {"modules": false}], "react"],
  "env": {
    "test": {
      "presets": [["env"], "react"]
    }
  }
}
```

> Note: `babel-jest` is automatically installed when installing Jest and will automatically transform files if a babel configuration exists in your project. To avoid this behavior, you can explicitly reset the `transform` configuration option:

```json
// package.json
{
  "jest": {
    "transform": {}
  }
}
```

### Using webpack

Jest can be used in projects that use [webpack](https://webpack.github.io/) to manage assets, styles, and compilation. webpack does offer some unique challenges over other tools. Refer to the [webpack guide](Webpack.md) to get started.

### Using TypeScript

Jest supports TypeScript out of the box, via Babel.

However, there are some caveats to using Typescript with Babel, see http://artsy.github.io/blog/2017/11/27/Babel-7-and-TypeScript/. Another caveat is that Jest will not typecheck your tests. If you want that, you can use [ts-jest](https://github.com/kulshekhar/ts-jest).
