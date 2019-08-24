# Jest Rut

[![Build Status](https://travis-ci.org/milesj/rut.svg?branch=master)](https://travis-ci.org/milesj/rut)
[![npm version](https://badge.fury.io/js/jest-rut.svg)](https://www.npmjs.com/package/jest-rut)
[![npm deps](https://david-dm.org/milesj/jest-rut.svg?path=packages/jest-rut)](https://www.npmjs.com/package/jest-rut)

Provides built-in matchers and serializers for asserting Rut render results.

## Requirements

- Jest 24.0+

## Installation

```
yarn add jest-rut
```

Append `jest-rut` to `setupFilesAfterEnv` in your `jest.config.js`.

```js
module.exports = {
  setupFilesAfterEnv: ['jest-rut'],
};
```

## Documentation

[https://milesj.gitbook.io/rut](https://milesj.gitbook.io/rut)
