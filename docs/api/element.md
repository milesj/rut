# `Element`

An `Element` is a wrapper around a React element (more specifically a
[test instance](https://reactjs.org/docs/test-renderer.html)) that provides more utility and
functionality (below). It can be accessed via the [root](./result.md#root) or when finding/querying
through another `Element` instance.

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

> debug(noLog?: boolean): string

Like the rendered result [`debug()`](./result.md#debug), but only represents the current elements
tree.

## `emit()`

> emit\<K extends keyof Props>(name: K, ...args: ArgsOf\<Props[K]>): ReturnOf\<Props[K]>

Emit an event listener for the defined prop name. Requires a list of arguments, and returns the
result of the emit.

To ease the interaction and testing flow of `Event` objects, Rut provides a
[`mockSyntheticEvent()`](../mocks.md) function.

```tsx
import { render, mockSyntheticEvent } from 'rut';

const { root } = render<LoginFormProps>(<LoginForm />);

root.findOne('input').emit('onChange', mockSyntheticEvent('change'));
```

> This may only be executed on host components (DOM elements). Why? Because it's an abstraction that
> forces testing on what the consumer will ultimately interact with. Executing listeners on a React
> component is a code smell.

## `find()`

> find\<Tag extends HostComponentType>(type: Tag): Element\<JSX.IntrinsicElements[Tag]>[]

> find\<Props>(type: React.ComponentType<Props>): Element\<Props>[]

Search through the current tree for all elements that match the defined React component or HTML tag.
If any are found, a list of `Element`s is returned.

```tsx
const { root } = render<NewsReelProps>(<NewsReel />);

// By component
const articles = root.find(NewsArticle);

// By HTML tag
const articles = root.find('article');
```

## `findOne()`

> findOne\<Tag extends HostComponentType>(type: Tag): Element\<JSX.IntrinsicElements[Tag]>

> findOne\<Props>(type: React.ComponentType\<Props>): Element\<Props>

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

## `prop()`

> prop\<K extends keyof Props>(name: K): Props[K] | undefined

Returns the value of a prop by name, or undefined if not found.

```tsx
const { root } = render<ButtonProps>(<Button type="submit" onClick={handleClick} />);

expect(root.prop('type')).toBe('submit');
```

## `props()`

> props(): Props

Returns an object of all props on the current element.

```tsx
const { root } = render<ButtonProps>(<Button type="submit" onClick={handleClick} />);

expect(root.props()).toEqual({
  type: 'submit',
  onClick: handleClick,
});
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

## Options

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

## `type()`

> type(): ElementType

Returns the type of element. If a React component, returns the component constructor. If a DOM node,
returns the tag name.

```tsx
const { root } = render<ButtonProps>(<Button />);

expect(root.type()).toBe(Button);
```

```tsx
const { root } = render(<div />);

expect(root.type()).toBe('div');
```
