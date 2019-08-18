# ⚛️ Rut

React unit testing made easy. DOM not included.

## Checklist

RENDERER

- [x] Render a component, including hooks, lifecycles, context, refs, and more.
- [x] Re-render the component without prop changes.
- [x] Re-render the component with updated props.
- [x] Unmount the component.
- [x] Query elements by name/type.
- [x] Debug JSX output of the React tree.
- [ ] Handle dives/HOCs in a clean way.
- [ ] Test rendering to the DOM???

ELEMENTS

- [x] Query elements by name/type.
- [x] Emit event handler props.
- [x] Access props, type, and children.

MATCHERS

- [x] Check if an empty (null) render or not.
- [x] Check element is found within a node or its children.
- [x] Check element is of a specific type.
- [x] Check common props, like `checked`, `disabled`, `className`, and `value`.

NOT SUPPORTED

- [`React.lazy`](https://github.com/facebook/react/issues/14170) - Not supported by
  `react-test-renderer`.
- `ReactDOM.createPortal` - Requires the DOM (duh).
