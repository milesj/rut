# Rut

Rut is a DOM-less React testing library that aims to be lightweight, encourage great testing
practices, and reduce flakiness and code smells. It is a wrapper and abstraction around
[react-test-renderer](https://reactjs.org/docs/test-renderer.html) that simplifies the test writing
process, while doing all the hard work behind the scenes.

```tsx
import { render } from 'rut';
import Input, { InputProps } from '../src/Input';

describe('<Input />', () => {
  it('renders an input field', () => {
    const { root, update } = await render<InputProps>(<Input name="rut" value="foo" />);

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
  _(Experimental)_
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

## Supported

- Class, function, pure, and `React.memo()` components (of course).
- Life-cycle phases, including mount, update, and unmount.
- Function children, render props, and other factory patterns.
- Higher-order components (HOCs) and all forms of composition.
- Hooks: `useState()`, `useRef()`, `useEffect()`, and all other built-in hooks!
- Context: `React.createContext()`, `useContext`, `contextType`, and even legacy.
- Refs: `React.createRef()`, `React.forwardRef()`, callback refs, and string refs.
- Error boundaries, fragments, strict mode, and more!

## Not Supported

- [`React.lazy(), React.Suspense`](https://github.com/facebook/react/issues/14170) - Currently not
  supported by `react-test-renderer`.
- [`ReactDOM.createPortal`](https://reactjs.org/docs/portals.html) - Requires the DOM. May be
  supported in a future `rut-dom` package.

## What's next?

Does all the above sound great to you? Perfect!

- [Setup and integrate Rut](./setup.md)
- [Learn about rendering components](./api.md)
- [Become a pro by using matchers](./matchers.md)
