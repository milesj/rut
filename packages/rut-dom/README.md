# Rut DOM

[![Build Status](https://github.com/milesj/rut/workflows/Build/badge.svg)](https://github.com/milesj/rut/actions?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/rut-dom.svg)](https://www.npmjs.com/package/rut-dom)
[![npm deps](https://david-dm.org/milesj/rut.svg?path=packages/rut-dom)](https://www.npmjs.com/package/rut-dom)

React DOM testing made easy! Rut DOM is a [Rut](https://www.npmjs.com/package/rut) testing adapter
that provides a simple streamlined API for writing component based integration tests.

```tsx
import { render } from 'rut-dom';
import Input, { InputProps } from '../src/Input';

describe('<Input />', () => {
  it('renders an input field', () => {
    const { root, update } = render<InputProps>(<Input name="rut" value="foo" />);

    expect(root).toHaveProp('name', 'rut');
    expect(root).toHaveValue('foo');
    expect(root).not.toBeDisabled();

    update({ disabled: true });

    expect(root).toBeDisabled();
  });
});
```

## Requirements

- React 16.9+ (Rut v1)
- React 17+ (Rut v2)

## Installation

```
yarn add --dev rut-dom react react-dom
```

## Documentation

[https://ruttest.dev](https://ruttest.dev)
