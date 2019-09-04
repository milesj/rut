# `Element`

An `Element` is a wrapper around a React element (more specifically a
[test instance](https://reactjs.org/docs/test-renderer.html)) that hides implementation details and
is primarily used for traversing the React tree. It can be accessed via the [root](./result.md#root)
or when finding/querying through another `Element` instance.

## `children()`

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

## `debug()`

> debug(options?: DebugOptions): string

Like the rendered result [`debug()`](./result.md#debug) but only represents the current element
tree.

## `emit()`

> emit\<K extends keyof Props>(name: K, options?: EmitOptions, ...args: ArgsOf\<Props[K]>):
> ReturnOf\<Props[K]>

Emit an event listener for the defined prop name. Requires a list of arguments, and returns the
result of the emit.

To ease the interaction and testing flow of `Event` objects, Rut provides a
[`mockSyntheticEvent()`](../mocks.md) function.

```tsx
import { render, mockSyntheticEvent } from 'rut';

const { root } = render<LoginFormProps>(<LoginForm />);

root.findOne('input').emit('change', {}, mockSyntheticEvent('change'));
```

> This may only be executed on host components (DOM elements). Why? Because it's an abstraction that
> forces testing on what the consumer will ultimately interact with. Executing listeners on a React
> component is a code smell.

### Options

- `propagate` (`boolean`) - Propagate the event up the tree by executing the same listener on every
  parent until hitting the root or the event has been stopped. _(Experimental)_

## `emitAndWait()`

> async emitAndWait\<K extends keyof Props>(name: K, options?: EmitOptions, ...args:
> ArgsOf\<Props[K]>): Promise\<ReturnOf\<Props[K]>>

Like [`emit()`](#emit) but waits for async calls within the dispatch and updating phase to complete
before returning the re-rendered result. Because of this, the function must be `await`ed.

```tsx
import { render, mockSyntheticEvent } from 'rut';

it('waits for update call to finish', async () => {
  const { root } = render<EditProfileProps>(<EditProfile id={1} />);

  await root.findOne('form').emitAndWait('submit', {}, mockSyntheticEvent('submit'));
});
```

## `find()`

> find\<Tag extends HostComponentType, Props = JSX.IntrinsicElements[Tag]>(type: Tag, props?:
> Partial\<Props>): Element\<Props>[]

> find\<Props>(type: React.ComponentType\<Props>, props?: Partial\<Props>): Element\<Props>[]

Search through the current tree for all elements that match the defined React component or HTML tag.
If any are found, a list of `Element`s is returned.

```tsx
const { root } = render<NewsReelProps>(<NewsReel />);

// By component
const articles = root.find(NewsArticle);

// By HTML tag
const articles = root.find('article');
```

Also accepts a partial props object as a 2nd argument. When defined, will further filter elements
and only return those that have the defined props in common.

```tsx
const { root } = render(
  <form>
    <input type="text" name="name" />
    <input type="email" name="email" />
    <input type="password" name="password" />
  </form>,
);

const input = root.find('input', { name: 'email' }); // 1
```

## `findOne()`

> findOne\<Tag extends HostComponentType, Props = JSX.IntrinsicElements[Tag]>(type: Tag, props?:
> Partial\<Props>): Element\<Props>

> findOne\<Props>(type: React.ComponentType\<Props>, props?: Partial\<Props>): Element\<Props>

Like [`find()`](#find) but only returns a single instance. If no elements are found, or too many
elements are found, an error is thrown.

## `name()`

> name(): string

Returns the name of the component (most commonly from `displayName`). If a component has been
wrapped with an HOC, it will attempt to preserve the name.

```tsx
const { root } = render<ButtonProps>(<Button />);

expect(root.name()).toBe('Button');
```

## `query()`

> query\<Props>(predicate: Predicate | ((node: TestNode, fiber: FiberNode) => boolean), options?:
> QueryOptions): Element\<Props>[]

A low-level abstraction for querying and finding components in the current tree using a predicate
function. This predicate is passed the `react-rest-renderer` test instance and a `react` fiber node,
for use in comparisons. To simplify this process, a [predicate](../predicates.md) can be used.

```tsx
const { root } = render<NewsReelProps>(<NewsReel />);

const articles = root.query(node => node.type === NewsArticle);
```

### Options

- `deep` (`boolean`) - Continue searching through the entire tree when a match is found, otherwise
  return the found result immediately. Defaults to `true`.

## `ref()`

> ref\<T>(name?: string): T | null

Returns any ref associated with the current component. The renderer will attempt to find a valid ref
using the following patterns, in order:

- If a ref is found on the internal React fiber node, it will be used.
- If defined as a class component instance property (either via `React.createRef()` or a callback
  ref), will match against the `name` provided.
- If defined as a string ref, will match against the `name` provided.
- Otherwise `null` is returned.

```tsx
class Input extends React.Component<InputProps> {
  inputRef = React.createRef<HTMLInputElement>();

  render() {
    return <input type="text" ref={this.inputRef} />;
  }
}

const { root } = render<InputProps>(<Input />);

root.ref('inputRef'); // <input />
```

> Be sure to mock your ref using the [`mockRef()`](../api.md#mockref) option.
