# FAQ

## Is the DOM really not required?

Rut itself does not require the DOM, nor does it use [JSDOM](https://github.com/jsdom/jsdom) for its
unit tests (our Jest `testEnvironment` is `node`).

However, if a component uses `window`, `document`, or any other browser based API, you will need the
DOM. An alternative would be to mock these APIs, but that might be more trouble than it's worth.

## How to handle async calls during a mount or update?

Testing async calls has been historically difficult, as you'd have to use arbitrary timers or await
a promise returning function. Rut attempts to mitigate this problem by capturing async calls and
waiting for them to resolve before returning a rendered result. This is typically done with the
[`renderAndWait`](./api.md#renderandwait), [`Result#updateAndWait`](./api/result.md#updateandwait),
and other methods like `*AndWait`.

An example of this can be found in the
[official async tests](https://github.com/milesj/rut/blob/master/packages/rut/tests/examples/async.test.tsx).

## How to check the props of an element?

Rut does not provide an API for directly accessing the props of an element, as it encourages bad
testing practices. Instead, you can use the [`toHaveProp()`](./matchers.md#toHaveProp) or
[`toHaveProps()`](./matchers.md#toHaveProps) matchers for checking props.

```tsx
interface Props {
  children: React.ReactNode;
  id?: string;
}

function PropsExample({ children, id }: Props) {
  return <div id={id}>{children}</div>;
}

// BAD
it('passes id down', () => {
  const wrapper = shallow(<PropsExample id="foo">Content</PropsExample>);

  expect(wrapper.prop('id')).toBe('foo');
});

// GOOD
it('passes id down', () => {
  const { root } = await render<Props>(<PropsExample id="foo">Content</PropsExample>);

  expect(root).toHaveProp('id', 'foo');
});
```

## How to access component state?

You don't! Accessing state is a code smell as it's an implementation detail. Instead, you should
test the result of the state change, and not the state itself.

```tsx
class StateExample extends React.Component<{}, { active: boolean }> {
  state = {
    active: false,
  };

  handleToggle = () => {
    this.setState(prevState => ({
      active: !prevState.active,
    }));
  };

  render() {
    return (
      <div>
        <span>{this.state.active ? 'Active' : 'Inactive'}</span>
        <button type="button" onClick={this.handleToggle}>
          Toggle
        </button>
      </div>
    );
  }
}

// BAD
it('renders active state', () => {
  const wrapper = shallow(<StateExample />);

  expect(wrapper.state('active')).toBe(false);

  wrapper.find('button').simulate('click');

  expect(wrapper.state('active')).toBe(true);
});

// GOOD
it('renders active state', () => {
  const { root } = await render(<StateExample />);

  expect(root).toContainNode('Inactive');

  root.findOne('button').dispatch('onClick');

  expect(root).toContainNode('Active');
});
```

## What about Enzyme?

[Enzyme](https://github.com/airbnb/enzyme) paved the way for React testing, but sadly, has fallen
from grace over the past few years. This is compounded by the following prevalent issues:

- New React features take quite some time before landing in Enzyme (Context took almost a year!),
  resulting in consumers either not adopting new React features, or simply not testing components
  that use new React features.
- Enzyme encourages bad testing practices and relies on implementation details. This includes direct
  access to state, props, and component instances, simulating events on non-DOM elements, and more.
- Changes to Enzyme core must be applied to all renderer types (shallow, mount, render) and all
  React version adapters (15, 16, etc). This is usually very tedious and problematic.

Rut aims to avoid these issues by utilizing the
[react-test-renderer](https://reactjs.org/docs/test-renderer.html) provided by the React core team,
and continually released alongside new REact versions.

## What about React Testing Library?

[RTL](https://testing-library.com/docs/react-testing-library/intro) and Rut serve a similar purpose,
have similar APIs, and align on the same best practices. The major difference is that RTL requires a
DOM and uses `react-dom` for tree rendering, while Rut is DOM-less and uses `react-test-renderer`.
Honestly, both are great solutions, so choose the one you like best!
