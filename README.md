# ⚛️ Rut

React unit testing made easy. DOM not included.

## Checklist

RENDERER

- [x] Render a component, including hooks, lifecycles, context, refs, and more.
- [x] Re-render the component without prop changes.
- [x] Re-render the component with updated props.
- [x] Unmount the component.
- [x] Query elements by name/type.
- [ ] Debug JSX output of the React tree.
  - TEST MORE VALUES, arrays, objects, etc.
- [ ] Handle dives/HOCs in a clean way.
- [ ] Test rendering to the DOM (`rut-dom`).
- [ ] Wrapping component option.
- [ ] Strict mode option.

ELEMENTS

- [x] Query elements by name/type.
- [x] Emit event handler props.
- [x] Access props, type, and children.

MATCHERS

- [x] Check if an empty (null) render or not.
- [x] Check element is found within a node or its children.
- [x] Check element is of a specific type.
- [x] Check common props, like `checked`, `disabled`, `className`, and `value`.

SUPPORTED

- [x] Class components.
  - [x] Life-cycles.
  - [ ] State changes.
  - [ ] Pure.
- [x] Function components.
  - [ ] Hooks.
  - [ ] Memo.
- [x] Context: `Provider`, `Consumer`, `useContext`.
- [x] Refs: `createRef`, `forwardRef`, callback and string refs.
- [x] Error boundaries.
- [x] Fragments.
- [ ] Function children.
- [ ] Render props.
- [ ] HOCs.
- [ ] Event emitting.
- [ ] Uncontrolled forms.

NOT SUPPORTED

- [`React.lazy, React.Suspense`](https://github.com/facebook/react/issues/14170) - Not supported by
  `react-test-renderer`.
- `ReactDOM.createPortal` - Requires the DOM (duh).
