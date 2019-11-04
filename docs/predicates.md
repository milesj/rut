# Predicates

A predicate is a function for [querying](./api#query) against a React element's tree. The following
factories can be used for generating predicate clauses.

## `whereKey()`

> whereKey(value: React.Key | React.Key[]): Predicate

Find all elements where their `key` matches the provided value or values.

```tsx
import { render, whereKey } from 'rut-dom';

const { root } = render(
  <ItemList>
    {items.map(item => (
      <Item key={item.id} item={item} />
    ))}
  </ItemList>,
);

root.query(whereKey(123));
// Or
root.query(whereKey([123, 456]));
```

## `whereProps()`

> whereProps(props: { [name: string]: unknown }): Predicate

Find all elements in common with the provided props, regardless of component `type`.

```tsx
import { render, whereProps } from 'rut-dom';

const { root } = render(
  <ColorPalette>
    <Color value="red" />
    <Color value="blue" />
    <Color value="green" />
  </ColorPalette>,
);

root.query(whereProps({ value: 'red' }));
```
