# Matchers

Matchers let you test values and patterns, either simple or complex, in a succint way.

> The examples below are using Jest matchers, but the same approach can be used for other testing
> frameworks.

## `toBeChecked()`

> toBeChecked(): boolean

Check that an element has a truthy `checked` or `defaultChecked` prop. This is most commonly used
with form fields.

```tsx
const { root } = render<InputProps>(<Input checked />);

expect(root).toBeChecked(); // true
```

## `toBeDisabled()`

> toBeChecked(): boolean

Check that an element has a truthy `disabled` prop. This is most commonly used with form fields.

```tsx
const { root } = render<InputProps>(<Input disabled />);

expect(root).toBeDisabled(); // true
```

## `toBeElementType()`

> toBeElementType(type: React.ElementType): boolean

Check that an element is a valid React element type. Accepts either a class or function component,
or the name of a host component (HTML tag).

```tsx
const { root } = render<InputProps>(<Input disabled />);

expect(root).toBeElementType(Input); // true
```

```tsx
const { root } = render(<div />);

expect(root).toBeElementType('div'); // true
```

## `toContainNode()`

> toContainNode(node: React.ReactNode): boolean

Check that an element contains a node (string, element, etc) within its children.

```tsx
const { root } = render(<div>Hello world</div>);

expect(root).toContainNode('Hello world'); // true
```

Will also check for the node at any depth in the current tree.

```tsx
const { root } = render(
  <div>
    <article>
      <h1>Rut</h1>
    </article>
  </div>,
);

expect(root).toContainNode('Rut'); // true
```

And when checking elements, it will compare the component type and props for shallow equality.

```tsx
const { root } = render(
  <div>
    <article>
      <Title level={1}>Rut</Title>
    </article>
  </div>,
);

expect(root).toContainNode(<Title level={1}>Rut</Title>'); // true
```

## `toHaveClassName()`

> toHaveClassName(name: string): boolean

Check that an element has a `className` prop that matches the defined value.

```tsx
const { root } = render(<div className="foo-bar" />);

expect(root).toHaveClassName('foo'); // false
```

## `toHaveKey()`

> toHaveKey(name: string): boolean

Check that an element has a React `key` that matches the provided value.

```tsx
const { root } = render(<div key={123} />);

expect(root).toHaveKey(123); // true
```

## `toHaveProp()`

> toHaveProp(name: string, value?: unknown): boolean

Check that an element has a prop that matches the provided name, with optional matching value.
Arrays and objects will be matched using shallow equality.

```tsx
const { root } = render(<div id="foo" />);

expect(root).toHaveProp('id'); // true
expect(root).toHaveProp('id', 'bar'); // false
```

## `toHaveProps()`

> toHaveProps(props: { [key: string]: unknown }): boolean

Check that an element's props match all the provided props and their values. Arrays and objects will
be matched using shallow equality.

```tsx
const { root } = render(<div id="foo" role="main" />);

expect(root).toHaveProps({ id: 'foo', role: 'main' }); // true
```

## `toHaveRendered()`

> toHaveRendered(): boolean

Check that a component has rendered children. If a component returns `null`, this will evaluate to
false.

```tsx
function NoChildren() {
  return null;
}

const { root } = render(<NoChildren />);

expect(root).toHaveRendered(); // false
```

```tsx
function WithChildren() {
  return <div />;
}

const { root } = render(<WithChildren />);

expect(root).toHaveRendered(); // true
```

## `toHaveValue()`

> toHaveValue(value: string): boolean

Check that an element has a `value` or `defaultValue` prop that matches the provided value. This is
most commonly used with form fields.

```tsx
const { root } = render<InputProps>(<Input defaultValue="foo" />);

expect(root).toHaveValue('foo'); // true
```
