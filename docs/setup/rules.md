# ESLint Rules

## `consistent-event-type`

Verify and enforce the correct event types are used when mocking or dispatching events.

```tsx
// Bad
import { mockEvent, mockSyntheticEvent } from 'rut';

mockEvent('onKeyDown');
mockSyntheticEvent('keydown');
```

```tsx
// Good
import { mockEvent, mockSyntheticEvent } from 'rut';

mockEvent('keydown');
mockSyntheticEvent('onKeyDown');
```

## `no-act`

Disallow usage of React's `act()` within tests. This functionality is provided by Rut and shouldn't
be necessary.

```tsx
// Bad
import { render } from 'rut';
import { act } from 'react-test-renderer';
import Example from '../src/Example';

const { update } = render(<Example id={1} />);

act(() => {
  update({ id: 2 });
});
```

```tsx
// Good
import { render } from 'rut';
import Example from '../src/Example';

const { update } = render(<Example id={1} />);

update({ id: 2 });
```

## `no-internals`

Disallow import and usage of Rut's internal APIs. Accessing these directly is a code smell.

```tsx
// Bad
import { render } from 'rut';
import debug from 'rut/lib/internals/debug';
import Example from '../src/Example';

const { root } = render(<Example id={1} />);

debug(root);
```

```tsx
// Good
import { render } from 'rut';
import Example from '../src/Example';

const { debug, root } = render(<Example id={1} />);

debug();
// Or
root.debug();
```

## `require-render-generics`

Require generics for `render()` and `renderAndWait()` functions.

```tsx
// Bad
import { render } from 'rut';
import Example from '../src/Example';

const { root } = render(<Example id={1} />);
```

```tsx
// Good
import { render } from 'rut';
import Example, { ExampleProps } from '../src/Example';

const { root } = render<ExampleProps>(<Example id={1} />);
```

> Does not apply to host (DOM) elements.
