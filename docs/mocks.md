# Mocks

What is testing without mocks? The following mock functions can be used for easier testing.

## `mockEvent()`

> mockEvent\<T = Event>(type: string, options?: EventOptions): T

If for some reason you need to mock a native DOM event, `mockEvent()` will do just that. Based on
the defined event type, an appropriate sub-class will be used. For example, if the `type` is
`click`, then a `MouseEvent` will be used.

If using TypeScript, it's encouraged to type the event using generics.

```ts
import { mockEvent } from 'rut';

const event = mockEvent<MouseEvent>('click');
```

> Event type format must match the native host format, usually lower case. For example, `click`
> instead of `onClick`.

### Options

All options are _optional_.

- `currentTarget` (`HTMLElement`) - Partial element in which the event was bound to.
- `target` (`HTMLElement`) - Partial element that triggered the event. If `currentTarget` is not
  defined, this will be used for both fields.
- **AnimationEvent**
  - `animationName` (`string`) - Name of the animation being triggered.
- **MouseEvent, KeyboardEvent, TouchEvent**
  - `altKey` ( `boolean`) - The alt key was pressed.
  - `ctrlKey` (`boolean`) - The control key was pressed.
  - `key` (`string`) - The key that was pressed.
  - `keyCode` (`number`) - The key that was pressed, as a numerical code.
  - `metaKey` (`boolean`) - The command key was pressed (Mac only).
  - `shiftKey` (`boolean`) - The shift key was pressed.
- **TransitionEvent**
  - `propertyName` (`string`) - Name of the property that triggered the transition.

## `mockFetch()`

> mockFetch(matcher: MockMatcher, response: MockResponse | MockResponseFunction, options?:
> MockOptions): FetchMockStatic

Generates and mocks the global `fetch()` with pre-defined responses, using the robust
[fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/) library.

```tsx
import { renderAndWait, mockFetch } from 'rut';
import UserProfile, { UserProfileProps } from '../src/UserProfile';

describe('<Form />', () => {
  beforeEach(() => {
    mockFetch('/users/1', {
      id: 1,
      name: 'Rut',
      status: 'active',
    });
  });

  it('loads a users profile', async () => {
    const { root } = await renderAndWait<UserProfileProps>(<UserProfile id={1} />);

    expect(root).toContainNode('Rut');
  });
});
```

To match all requests, provide a wildcard `*` route, and a response of `200`.

```ts
mockFetch('*', 200);
```

Since this mock returns a `fetch-mock` instance, all upstream API methods are available. For
example, we can easily mock multiple requests using a fluent interface.

```ts
mockFetch('/', 200)
  .get('/users/1', 200)
  .get('/users/2', 404)
  .post('/users', 200);
```

Lastly, if _not_ using [Jest](./setup.md#jest), you'll need to unmock the fetch after every test
using `restore()`.

```ts
let mock: MockFetchResult;

beforeEach(() => {
  mock = mockFetch('/users/1', {
    id: 1,
    name: 'Rut',
    status: 'active',
  });
});

afterEach(() => {
  mock.restore();
});
```

## `mockSyntheticEvent()`

> mockSyntheticEvent\<T = React.SyntheticEvent>(type: EventType, options?: EventOptions): T

Generates `React.SyntheticEvent` and native `Event` mocks for use within event dispatching. Based on
the defined event type, an appropriate sub-class will be used. For example, if the `type` is
`onClick`, then a `React.MouseEvent` (with a native `MouseEvent` of type `click`) will be used.

```tsx
import { render, mockSyntheticEvent } from 'rut';
import Form, { FormProps } from '../src/Form';

describe('<Form />', () => {
  it('triggers click', () => {
    const spy = jest.fn();
    const { root } = render<FormProps>(<Form onClick={spy} />);

    root.findOne('button').dispatch('onClick', mockSyntheticEvent('onClick'));

    expect(spy).toHaveBeenCalled();
  });
});
```

When using TypeScript, the `T` generic will infer the event type based on the `dispatch()` event
being dispatched. In the above example, the `T` would resolve to
`React.MouseEvent<HTMLButtonElement, MouseEvent>`. However, this only works when the mock is created
within `dispatch()`s signature. If the event is created outside of it, the type will need to be
explicitly defined.

```tsx
const event = mockSyntheticEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>('onClick');
const spy = jest.spyOn(event, 'preventDefault');

root.findOne('button').dispatch('onClick', event);
```

Supports the same [options](#options) as [`mockEvent()`](#mockevent).

> Event type format must match the prop it's based on. For example, `onClick` instead of `click`.
