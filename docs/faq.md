# FAQ

## Is the DOM really not required?

Rut itself does not require the DOM, nor does it use [JSDOM](https://github.com/jsdom/jsdom) for its
unit tests (our Jest `testEnvironment` is `node`).

However, if a component uses `window`, `document`, or any other browser based API, you will need the
DOM. An alternative would be to mock these APIs, but that might be more trouble than it's worth.

## How to handle async calls during a mount or update?

TODO

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
  const { root } = render<Props>(<PropsExample id="foo">Content</PropsExample>);

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
  const { root } = render(<StateExample />);

  expect(root).toContainNode('Inactive');

  root.findOne('button').dispatch('onClick', {}, mockSyntheticEvent('onClick'));

  expect(root).toContainNode('Active');
});
```
