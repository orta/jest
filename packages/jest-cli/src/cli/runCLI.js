/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import type {Argv} from 'types/Argv';
import type {AggregatedResult} from 'types/TestResult';
import type {Path} from 'types/Config';

const Runtime = require('jest-runtime');

const {Console, clearLine} = require('jest-util');
const {createDirectory} = require('jest-util');
const {readConfig} = require('jest-config');
const chalk = require('chalk');
const createContext = require('../lib/createContext');
const getMaxWorkers = require('../lib/getMaxWorkers');
const handleDeprecationWarnings = require('../lib/handleDeprecationWarnings');
const logDebugMessages = require('../lib/logDebugMessages');
const preRunMessage = require('../preRunMessage');
const runJest = require('../runJest');
const TestWatcher = require('../TestWatcher');
const watch = require('../watch');

const VERSION = require('../../package.json').version;

module.exports = async (
  argv: Argv,
  projects: Array<Path>,
  onComplete: (results: ?AggregatedResult) => void,
) => {
  const realFs = require('fs');
  const fs = require('graceful-fs');
  fs.gracefulify(realFs);

  const pipe = argv.json ? process.stderr : process.stdout;
  if (argv.version) {
    pipe.write(`v${VERSION}\n`);
    onComplete && onComplete();
    return;
  }

  const _run = async (globalConfig, configs) => {
    const hasteMapInstances = Array(configs.length);
    const contexts = await Promise.all(
      configs.map(async ({config}, index) => {
        createDirectory(config.cacheDirectory);
        const hasteMapInstance = Runtime.createHasteMap(config, {
          console: new Console(pipe, pipe),
          maxWorkers: getMaxWorkers(argv),
          resetCache: !config.cache,
          watch: globalConfig.watch,
          watchman: globalConfig.watchman,
        });
        hasteMapInstances[index] = hasteMapInstance;
        return createContext(config, await hasteMapInstance.build());
      }),
    );

    if (argv.watch || argv.watchAll) {
      if (configs.some(({hasDeprecationWarnings}) => hasDeprecationWarnings)) {
        try {
          await handleDeprecationWarnings(pipe, process.stdin);
          return watch(globalConfig, contexts, argv, pipe, hasteMapInstances);
        } catch (e) {
          process.exit(0);
        }
      }

      return watch(globalConfig, contexts, argv, pipe, hasteMapInstances);
    } else {
      const startRun = () => {
        if (!argv.listTests) {
          preRunMessage.print(pipe);
        }
        runJest(
          globalConfig,
          contexts,
          argv,
          pipe,
          new TestWatcher({isWatchMode: false}),
          startRun,
          onComplete,
        );
      };
      return startRun();
    }
  };

  try {
    let globalConfig;
    let hasDeprecationWarnings;
    let configs = [];
    let config;
    if (projects.length === 1) {
      ({config, globalConfig, hasDeprecationWarnings} = readConfig(
        argv,
        projects[0],
      ));
      configs = [{config, globalConfig, hasDeprecationWarnings}];
      if (globalConfig.projects && globalConfig.projects.length) {
        projects = globalConfig.projects;
      }
    }

    if (projects.length > 1) {
      configs = projects.map(root => readConfig(argv, root));
      // If no config was passed initially, use the one from the first project
      if (!globalConfig && !config) {
        globalConfig = configs[0].globalConfig;
        config = configs[0].config;
      }
    }

    if (!config || !globalConfig || !configs.length) {
      throw new Error('jest: No configuration found for any project.');
    }

    if (argv.debug || argv.showConfig) {
      logDebugMessages(globalConfig, config, pipe);
    }

    if (argv.showConfig) {
      process.exit(0);
    }

    await _run(globalConfig, configs);
  } catch (error) {
    clearLine(process.stderr);
    clearLine(process.stdout);
    console.error(chalk.red(error.stack));
    process.exit(1);
  }
};
