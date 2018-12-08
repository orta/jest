#!/usr/bin/env node

// Copyright (c) 2014-present, Facebook, Inc. All rights reserved.

const fs = require('fs');
const request = require('request');
const path = require('path');

const REQUIRED_KEYS = ['id'];

// prettier-ignore
request(
  'https://opencollective.com/api/groups/jest/backers',
  (err, response, body) => {
    if (err) console.error('Failed to fetch backers: ', err);

    // Basic validation
    const content = JSON.parse(body);

    if (!Array.isArray(content)) throw new Error('backer info is not an array');

    for (const item of content) {
      for (const key of REQUIRED_KEYS) {
        if (!item || typeof item !== 'object')
          // prettier-ignore
          throw new Error(
            `backer info item (${JSON.stringify(item)} is not an object`
          );
        if (!(key in item))
          // prettier-ignore
          throw new Error(
            `backer info item (${JSON.stringify(item)} doesn't include ${key}`
          );
      }
    }

    fs.writeFile(path.resolve(__dirname, 'backers.json'), body, err => {
      if (err) {
        console.error('Failed to write backers file: ', err);
      } else console.log('Fetched 1 file: backers.json');
    });
  }
);
