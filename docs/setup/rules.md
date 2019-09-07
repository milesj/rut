# ESLint Rules

- `no-act` - Disallow usage of React's `act()` within tests. This functionality is provided by Rut
  and shouldn't be necessary.
- `no-internals` - Disallow import and usage of Rut's internal APIs. Accessing these directly is a
  code smell.
- `require-render-generics` - Require generics for `render()` and `renderAndWait()` functions. Does
  not apply to host elements.
