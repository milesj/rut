---
title: Caveats
---

## Do not find a `React.memo()` component

When using [`Element#find()`](./api/element.md#find) (and variants) or
[`Element#query()`](./api/element.md#query), you may run into an issue where the component reference
you're trying to find is not found. This is usually caused by component references that are wrapped
in `React.memo()`, as memo components do not appear in the reconciled tree, and as such, cannot be
found!

To work around this, the component that is being wrapped by `React.memo()` is the one that should be
used, _not_ the memoized component. A typical pattern in HOCs is to provide the wrapped component as
a static property, like `Foo.WrappedComponent`, which can also be used.

```tsx
import React from 'react';
import { render } from 'rut-dom';

function BaseComp() {
  return <div />;
}

const MemoComp = React.memo(BaseComp);

const { root } = render(
  <App>
    <MemoComp />
  </App>,
);

// Wrong
root.findOne(MemoComp);

// Correct
root.findOne(BaseComp);
```

## String interpolation must match for `toContainNode()`

When an element uses interpolation within its children, and you're attempting to find a node using
an element (and not a string), the expectation must also use interpolation. For example, take this
component that renders a user's name, and some assertions checking for a node.

```tsx
function User({ firstName, lastName }: { firstName: string; lastName: string }) {
  return (
    <h1>
      {user.firstName} {user.lastName}
    </h1>
  );
}

const { root } = render(<User firstName="Bruce" lastName="Wayne" />);

// Works
expect(root).toContainNode('Bruce Wayne');

// Does not work???
expect(root).toContainNode(<h1>Bruce Wayne</h1>);
```

The reason the latter doesn't work is because of how React's internals work. When interpolation is
used, the `children` prop becomes an array, resulting in the rendered children to be
`['Bruce', ' ', 'Wayne']`, while the expectation's children is simply `'Bruce Wayne'`. These do not
match! To fix this, the expectation must also use matching interpolations.

```tsx
// Works
expect(root).toContainNode(
  <h1>
    {'Bruce'} {'Wayne'}
  </h1>,
);
```

When in doubt, just use strings!
