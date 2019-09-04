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

### Options

- `currentTarget` (`HTMLElement`) - The element in which the event was bound to. _(Optional)_
- `target` (`HTMLElement`) - The element that triggered the event. If `currentTarget` is not
  defined, this will be used for both fields. _(Optional)_

## `mockSyntheticEvent()`

> mockSyntheticEvent\<T = React.SyntheticEvent>(type: EventType, options?: EventOptions): T

Generates `React.SyntheticEvent` and native `Event` mocks for use within event emitting. Based on
the defined event type, an appropriate sub-class will be used. For example, if the `type` is
`onClick`, then a `React.MouseEvent` (with a native `MouseEvent` of type `click`) will be used.

```ts
import { render, mockSyntheticEvent } from 'rut';

const { root } = render(<Form />);

root.findOne('button').emit('onClick', {}, mockSyntheticEvent('onClick'));
```

When using TypeScript, the `T` generic will infer the event type based on the `emit()` event being
dispatched. In the above example, the `T` would resolve to
`React.MouseEvent<HTMLButtonElement, MouseEvent>`. However, this only works when the mock is created
within `emit()`s arguments. If the event is created outside of it, the type will need to be
explicitly defined.

```tsx
const event = mockSyntheticEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>('onClick');
const spy = jest.spyOn(event, 'preventDefault');

root.findOne('button').emit('onClick', {}, event);
```

Supports the same [options](#options) as `mockEvent()`.
