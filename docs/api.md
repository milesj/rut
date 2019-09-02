# API

## `configure()`

> configure(options: RendererOptions): void

Define global options that will be used across all tests.

```ts
import { configure } from 'rut';

configure({
  strict: true,
});
```

### Options

#### `mockRef()`

> (element: React.ReactElement) => unknown

Mock a ref found within the current render tree. This mock function is passed the React element
being referenced, for use in determining and providing a custom mock. For example:

```tsx
import { render, mockSyntheticEvent } from 'rut';

const spy = jest.fn();
const { root } = render<LoginFormProps>(<LoginForm />, {
  mockRef(element) {
    if (element.type === 'input' && element.props.type === 'password') {
      return { onChange: spy };
    }
  },
});

root.findOne('input').emit('change', {}, mockSyntheticEvent('change'));

expect(spy).toHaveBeenCalled();
```

#### `strict`

> boolean

Wraps the [root](./api/result.md#root) element in `React.StrictMode`, logging all deprecations
within the current tree. Can be used in unison with the `wrapper` option below.

```tsx
render<ButtonProps>(<Button>Save</Button>, {
  strict: true,
});
```

#### `wrapper`

> React.ReactElement

Wraps the [root](./api/result.md#root) element in the provided React element. Useful for wrapping
shared functionality across multiple test suites, like contexts. Can be used in unison with the
`strict` option above.

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

## `render()`

> render\<Props>(element: React.ReactElement, options?: RendererOptions): Result\<Props>

Accepts a React element and an optional [options](#configure) object, and returns a
[rendered result](./api/result.md). This function is merely a wrapper around
[react-test-renderer](https://reactjs.org/docs/test-renderer.html), providing additional
functionality, and an improved API.

```tsx
import { render } from 'rut';

test('renders a button', () => {
  const result = render<ButtonProps>(<Button>Save</Button>);
});
```

If using TypeScript, it's highly encouraged to pass the props interface as a generic to `render`, so
that props, children, and other features can be typed correctly. This information is currently not
inferrable as `JSX.Element` does not persist types.

Furthermore, if the `root` is a host component (DOM element), you can apply props using the
`HostProps` utility type.

```tsx
import { render, HostProps } from 'rut';

test('renders a native button', () => {
  const result = render<HostProps<'button'>>(<button type="submit">Save</button>);
});
```

## `renderAndWait()`

> async renderAndWait\<Props>(element: React.ReactElement, options?: RendererOptions):
> Result\<Props>

Works in a similar fashion to [`render()`](#render) but also waits for async calls within the
mounting phase to complete before returning the [rendered result](./api/result.md). Because of this,
the function must be `await`ed.

```tsx
import { renderAndWait } from 'rut';

test('renders a user profile', async () => {
  const result = await renderAndWait<UserProfileProps>(<UserProfile id={1} />);
});
```
