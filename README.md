# Rut

[![Build Status](https://travis-ci.org/milesj/rut.svg?branch=master)](https://travis-ci.org/milesj/rut)
[![npm version](https://badge.fury.io/js/rut.svg)](https://www.npmjs.com/package/rut)
[![npm deps](https://david-dm.org/milesj/rut.svg?path=packages/rut)](https://www.npmjs.com/package/rut)

Rut is a DOM-less React testing library that aims to be lightweight, encourage great testing
practices, and reduce flakiness and code smells. It is a wrapper and abstraction around
[react-test-renderer](https://reactjs.org/docs/test-renderer.html) that simplifies the test writing
process, while doing all the hard work behind the scenes.

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
- First-class async support. Wait for async calls to finish before returning a rendered result.
- Deep [`act()`](https://reactjs.org/docs/testing-recipes.html#act) integration. Let Rut do the
  heavy lifting.
- Update a component with new props, children, or a completely new element.
- Unmount a component to verify cleanup and destructor based logic.
- Dispatch DOM level events with a mocked synthetic event (and propagation coming soon!).
- Wrap all renders with a defined wrapping component and or `React.StrictMode`.
- Apply pre-built mocks for robust and accurate testing.
- Utilize an array of pre-built matchers for easily querying, expecting, and asserting.

## Best Practices

Encourages the [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert) testing pattern.

_Arrange:_ Renders the entire component tree (instead of shallow) for a more accurate representation
of your component. Requires fetches, events, contexts, and more, to be properly mocked or setup
before hand.

_Act:_ With no direct access to state or internals, it forces you to interact with your tree in the
same manner your user would. Dispatch events to toggle states or execute handlers, like a form
submission.

_Assert:_ Test your expectations using pre-built matchers for common testing scenarios and patterns
while avoiding implementation details.

## Requirements

- React 16.9+
- Jest or another testing framework

## Documentation

[https://milesj.gitbook.io/rut](https://milesj.gitbook.io/rut)
