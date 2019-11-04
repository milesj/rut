# Rut DOM

[![Build Status](https://travis-ci.org/milesj/rut.svg?branch=master)](https://travis-ci.org/milesj/rut)
[![npm version](https://badge.fury.io/js/rut-dom.svg)](https://www.npmjs.com/package/rut-dom)
[![npm deps](https://david-dm.org/milesj/rut.svg?path=packages/rut-dom)](https://www.npmjs.com/package/rut-dom)

A [Rut](https://www.npmjs.com/package/rut) testing adapter for DOM based applications.

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

- React 16.9+

## Installation

```
yarn add --dev rut-dom
```

## Documentation

[https://milesj.gitbook.io/rut](https://milesj.gitbook.io/rut)
