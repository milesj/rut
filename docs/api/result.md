# Result

The rendered result contains a handful of methods and properties for asserting against, they are:

## `root`

> Element\<Props>

The React element passed to `render`, represented as an [Element](./element.md) instance. This is
the entry point into the entire rendered React tree.

```tsx
const { root } = render<ButtonProps>(<Button>Save</Button>);

expect(root).toContainNode('Save'); // true
```

> If either `strict` or `wrapper` options are defined, the `root` will still point to the element
> initially passed in.

## `debug()`

> debug(options?: DebugOptions): string

Logs or returns a JSX representation of the _reconciled_ React component tree. By default this will
log to the console.

```tsx
const { debug } = render<ButtonProps>(<Button>Save</Button>);

debug();

const out = debug({ return: true });
```

The example above would log something similar to the following.

```tsx
<Button>
  <button type="button">Save</button>
</Button>
```

> This function logs the reconciled tree. What this means is that exotic components, like context
> consumers and providers, memo, fragments, and more, will not be shown. Only the "result" of the
> render.

### Options

- `groupProps` (`boolean`) - Group props into the following: key & ref, truthy booleans, everything
  else, event handlers. Defaults to `true`.
- `hostElements` (`boolean`) - Include host elements (DOM) in the output. Defaults to `true`.
- `keyAndRef` (`boolean`) - Include `key` and `ref` props in the output. Defaults to `true`.
- `reactElements` (`boolean`) - Include React elements in the output. Defaults to `true`.
- `return` (`boolean`) - Do not log to the console and instead return the output. Defaults to
  `false`.
- `sortProps` (`boolean`) - Sort the props within each grouping from A-Z. Defaults to `true`.

## `rerender()`

> rerender(element: React.ReactElement\<Props>, options?: RendererOptions): Element\<Props>

Re-render the in-memory tree with an updated [root](#root) element and optional options, and return
the new root element. This is a perfect opportunity to update or replace the `wrapper` element.

```tsx
const { root, rerender } = render<InputProps>(<Input name="email" />, {
  wrapper: <Form method="GET" />,
});

// Change props and wrapper
const newRoot = rerender(<Input name="email" id="email" />, {
  wrapper: <Form method="POST" />,
});
```

If you don't destructure the result, you may use the `root` on the initial returned result, instead
of using the new root, as the instance is preserved.

```tsx
const result = render<InputProps>(<Input name="email" />, {
  wrapper: <Form method="GET" />,
});

result.rerender(<Input name="email" id="email" />, {
  wrapper: <Form method="POST" />,
});

result.root; // Latest
```

> This method is not available when using `renderAndWait()`.

## `rerenderAndWait()`

> async rerenderAndWait(element: React.ReactElement\<Props>, options?: RendererOptions):
> Promise\<Element\<Props>>

Like [`rerender()`](#rerender) but also awaits the re-render so that async calls have time to
finish.

```tsx
const { root, rerenderAndWait } = await renderAndWait<InputProps>(<Input name="email" />, {
  wrapper: <Form method="GET" />,
});

// Change props and wrapper
const newRoot = await rerenderAndWait(<Input name="email" id="email" />, {
  wrapper: <Form method="POST" />,
});
```

> This method is not available when using `render()`.

## `update()`

> update(newProps?: Partial\<Props>, newChildren?: React.ReactNode): void

Can be used to update the [root](#root)'s props or children. When passing no arguments, will
re-render the element with current props and children (useful for testing cache and conditionals).

```tsx
const { update } = render<ButtonProps>(<Button type="button">Save</Button>);

update(); // Re-render
```

Otherwise, accepts an object of partial props as the first argument, or a new child as the second.
Can be used separately or together.

```tsx
// Change `type` prop
update({ type: 'submit' });

// Change children
update({}, <span>Submit</span>);

// Change both
update({ type: 'submit' }, <span>Submit</span>);
```

## `updateAndWait()`

> async updateAndWait(newProps?: Partial\<Props>, newChildren?: React.ReactNode): Promise\<void>

Like [`update()`](#update) but waits for async calls within the updating phase to complete before
returning the re-rendered result. Because of this, the function must be `await`ed.

```tsx
const { root, updateAndWait } = render<UserListProps>(<UserList />);

expect(root.find(User)).toHaveLength(10);

await updateAndWait({ filters: { inactive: true } });

expect(root.find(User)).toHaveLength(3);
```

## `unmount()`

> unmount(): void

Like the name states, this triggers an unmount. This isn't necessary to call in every test, just
when you want to test the unmounting phase.

```tsx
const { unmount } = render<ButtonProps>(<Button>Save</Button>);

unmount();
```
