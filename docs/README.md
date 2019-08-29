# Rut

Rut is a DOM-less **R**eact **u**nit **t**esting library that aims to be lightweight and simple,
encourage great testing practices, and reduce code smells and flakiness. It is a wrapper and
abstraction around [react-test-renderer](https://reactjs.org/docs/test-renderer.html) that
simplifies the test writing process, while doing all the hard work behind the scenes.

## Features

- Type safe by design. Test with confidence.
- First-class async support. Wait for async calls to complete before returning a rendered result,
  and asserting against it.
- Deep [`act()`](https://reactjs.org/docs/testing-recipes.html#act) integration. Let Rut do the
  heavy lifting. You simply worry about asserting.
- Update a component with new props, children, or a completely new element.
- Unmount a component to verify cleanup and destructor based logic.
- Emit DOM level events with a mocked synthetic event (and propagation coming soon!).
- Wrap all renders with a defined wrapping component and or `React.StrictMode`.
- Apply pre-built mocks for robust and accurate testing.
- Utilize an array of pre-built matchers for easily querying, expecting, and asserting common test
  patterns.

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
