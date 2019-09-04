# Rut

[![Build Status](https://travis-ci.org/milesj/rut.svg?branch=master)](https://travis-ci.org/milesj/rut)
[![npm version](https://badge.fury.io/js/rut.svg)](https://www.npmjs.com/package/rut)
[![npm deps](https://david-dm.org/milesj/rut.svg?path=packages/rut)](https://www.npmjs.com/package/rut)

Rut is a DOM-less **R**eact **u**nit **t**esting library that aims to be lightweight, encourage
great testing practices, and reduce flakiness and code smells. It is a wrapper and abstraction
around [react-test-renderer](https://reactjs.org/docs/test-renderer.html) that simplifies the test
writing process, while doing all the hard work behind the scenes.

```tsx
import { render } from 'rut';
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

## Features

- Type safe by design. Test with confidence.
- First-class async support. Wait for async calls to finish before returning a rendered result, and
  testing against it.
- Deep [`act()`](https://reactjs.org/docs/testing-recipes.html#act) integration. Let Rut do the
  heavy lifting. You simply worry about asserting.
- Update a component with new props, children, or a completely new element.
- Unmount a component to verify cleanup and destructor based logic.
- Emit DOM level events with a mocked synthetic event (and propagation coming soon!).
- Wrap all renders with a defined wrapping component and or `React.StrictMode`.
- Apply pre-built mocks for robust and accurate testing.
- Utilize an array of pre-built matchers for easily querying, expecting, and asserting common test
  patterns.

## Requirements

- React 16.9+

## Installation

```
yarn add --dev rut
```

## Documentation

[https://milesj.gitbook.io/rut](https://milesj.gitbook.io/rut)
