# API

## `render()`

> render<Props>(element: ReactElement, options?: RendererOptions): Result<Props>

Accepts a React element and returns a rendered result. This function is merely a wrapper around
[react-test-renderer](https://reactjs.org/docs/test-renderer.html), providing additional
functionality, and an improved API.

```tsx
import { render } from 'rut';

test('renders a button', () => {
  const result = render<ButtonProps>(<Button>Save</Button>);
});
```

### Options

The following options can be passed to the second argument.

#### `mockRef()`

> (element: ReactElement) => unknown

Mock any ref found within the current render tree. The function is passed the React element being
referenced, for use in determining which mock to return. For example:

```tsx
const spy = jest.fn();
const { root } = render<LoginFormProps>(<LoginForm />, {
  mockRef(element) {
    if (element.type === 'input' && element.props.type === 'password') {
      return { onChange: spy };
    }
  },
});

root.findOne('input').emit('onChange', mockSyntheticEvent('change'));

expect(spy).toHaveBeenCalled();
```

#### `strict`

> boolean

Wraps the [root](#root) element in `React.StrictMode`, logging all deprecations within the current
tree. Can be used in unison with the `wrapper` option below.

```tsx
render<ButtonProps>(<Button>Save</Button>, {
  strict: true,
});
```

#### `wrapper`

> ReactElement

Wraps the [root](#root) element in the provided React element. Useful for wrapping shared
functionality across multiple test suites, like contexts. Can be used in unison with the `strict`
option above.

```tsx
function Wrapper({ children }: { children?: React.ReactNode }) {
  return (
    <ThemeContext.Provider value="dark">
      <DirectionContext.Provider value="ltr">{children}</DirectionContext.Provider>
    </ThemeContext.Provider>
  );
}

render<ButtonProps>(<Button>Save</Button>, {
  wrapper: <Wrapper />,
});
```

> The wrapping component must render `children`.

### Result

The rendered result contains a handful of methods and properties for asserting against.

#### `root`

> Element<Props>

The React element passed to `render`, represented as an [Element](#element) instance. This is the
entry point into the entire rendered React tree.

```tsx
const { root } = render<ButtonProps>(<Button>Save</Button>);

expect(root).toContainNode('Save');
```

> If either `strict` or `wrapper` options are defined, the `root` will still point to the element
> initially passed in.

#### `debug()`

> debug(noLog?: boolean): string

Logs or returns a JSX representation of the _reconciled_ React component tree. By default this will
log to the console. Pass `true` as an only argument to disable this functionality.

```tsx
const { debug } = render<ButtonProps>(<Button>Save</Button>);

debug();

const out = debug(true);
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

#### `update()`

> update(newPropsOrElement?: Partial<Props> | ReactElement, newChildren?: ReactNode): void

Can be used to update the [root](#root) props, children, or element itself. Accepts any of the
following patterns.

When passing no arguments, will re-render the element with current props and children (useful for
testing cache and conditionals).

```tsx
const { update } = render<ButtonProps>(<Button>Save</Button>);

update();
```

Accepts an object of partial props as the first argument, or a new child as the second. Can be used
separately or together.

```tsx
// Change `type` prop
update({ type: 'submit' });

// Change children
update({}, <span>Submit</span>);

// Change both
update({ type: 'submit' }, <span>Submit</span>');
```

And lastly, accepts a React element. This approach is useful for either completely replacing the
element, or updating the props of nested elements.

```tsx
update(
  <Button type="submit">
    <span>Submit</span>
  </Button>,
);
```

#### `updateAndWait()`

> async updateAndWait( newPropsOrElement?: Partial<Props> | ReactElement, newChildren?: ReactNode ):
> Promise<void>

Like `update()` but waits for async calls within the updating phase to complete before returning the
re-rendered result. Because of this, the function must be `await`ed.

```tsx
const { root, updateAndWait } = render<UserListProps>(<UserList />);

expect(root.find(User)).toHaveLength(10);

await updateAndWait({ filters: { location: 'USA' } });

expect(root.find(User)).toHaveLength(3);
```

#### `unmount()`

> unmount(): void

Like the name states, this simply triggers an unmount.

```tsx
const { unmount } = render<ButtonProps>(<Button>Save</Button>);

unmount();
```

## `act()`

Re-exports [act](https://reactjs.org/docs/test-renderer.html#testrendereract) from `react-test-renderer`.

## `renderAndWait()`

> async renderAndWait<Props>(element: ReactElement, options?: RendererOptions): Result<Props>

Works in a similar fashion to `render()` but also waits for async calls within the mounting phase to
complete before returning the rendered result. Because of this, the function must be `await`ed.

```tsx
import { renderAndWait } from 'rut';

test('renders a user profile', async () => {
  const result = await renderAndWait<UserProfileProps>(<UserProfile id={1} />);
});
```

## `Element`

An `Element` is a wrapper around a React element (more specifically a
[test instance](https://reactjs.org/docs/test-renderer.html)) that provides more utility and
functionality (below). It can be accessed via the [root](#root) or when finding/querying.

### `children()`

> children(): (string | Element)[]

Returns all direct children as a list of strings and `Element`s.

```tsx
const { root } = render<CardProps>(
  <Card>
    <h3>Title</h3>
    Some description.
  </Card>,
);

root.children(); // [<h3 />, #text]
```

### `emit()`

> emit<K extends keyof Props>(name: K, ...args: ArgsOf<Props[K]>): ReturnOf<Props[K]>

TODO

### `find()`

> find<Tag extends HostComponentType>(type: Tag): Element<JSX.IntrinsicElements[Tag]>[]

> find<Props>(type: React.ComponentType<Props>): Element<Props>[]

Search through the current tree for all elements that match the defined React component or HTML
type. If any are found, a list of `Element`s is returned.

```tsx
const { root } = render<NewsReelProps>(<NewsReel />);

// By component
root.find(NewsArticle);

// By HTML tag
root.find('div');
```

### `findOne()`

> findOne<Tag extends HostComponentType>(type: Tag): Element<JSX.IntrinsicElements[Tag]>

> findOne<Props>(type: React.ComponentType<Props>): Element<Props>

Like `find()` but only returns a single instance. If no elements are found, or too many elements are
found, an error is thrown.

### `name()`

> name(): string

Returns the name of the component (most commonly from `displayName`). If a component has been
wrapped with an HOC, it will attempt to preserve the name.

```tsx
const { root } = render<ButtonProps>(<Button />);

expect(root.name()).toBe('Button');
```

### `prop()`

> prop<K extends keyof Props>(name: K): Props[K] | undefined

TODO

### `props()`

> props(): Props

TODO

### `query()`

> query<Props>(predicate: (node: TestNode, fiber: FiberNode) => boolean, options?: QueryOptions):
> Element<Props>[]

TODO

### `ref()`

> ref<T>(name?: string): T | null

TODO

### `type()`

> type(): ElementType

Returns the type of element. If a React component, returns the component constructor. If a DOM node,
returns the HTML tag name.

```tsx
const { root } = render<ButtonProps>(<Button />);

expect(root.type()).toBe(Button);
```

```tsx
const { root } = render(<div />);

expect(root.type()).toBe('div');
```
