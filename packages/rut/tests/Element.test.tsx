import React, { useState } from 'react';
import { render } from '../src/render';
import { mockSyntheticEvent } from '../src/mocks/event';
import {
  FuncComp,
  FuncCompWithDisplayName,
  ClassComp,
  ClassCompWithDisplayName,
  TestProps,
} from './fixtures';
import { runAsyncCall } from './helpers';

describe('Element', () => {
  it('can serialize as a snapshot', () => {
    const { root } = render<TestProps>(
      <FuncComp>
        <b>Child</b>
      </FuncComp>,
    );

    expect(root).toMatchSnapshot();
  });

  describe('debug()', () => {
    it('debugs based on element depth', () => {
      const { root } = render<{}>(
        <div>
          <section>
            <article>
              <h1>Title</h1>
            </article>
          </section>
        </div>,
      );

      expect(root.debug({ log: false })).toMatchSnapshot();
      expect(root.findOne('section').debug({ log: false })).toMatchSnapshot();
      expect(root.findOne('h1').debug({ log: false })).toMatchSnapshot();
    });
  });

  describe('dispatch()', () => {
    it('errors if prop does not exist', () => {
      expect(() => {
        const { root } = render(
          <div>
            <span />
          </div>,
        );

        // @ts-ignore
        root.findOne('span').dispatch('onFake');
      }).toThrowError('Prop `onFake` does not exist.');
    });

    it('errors if prop is not a function', () => {
      expect(() => {
        const { root } = render(
          <div>
            <span id="foo" />
          </div>,
        );

        // @ts-ignore
        root.findOne('span').dispatch('id');
      }).toThrowError('Prop `id` is not a function.');
    });

    it('errors if dispatching on a non-host component', () => {
      interface DispatchProps {
        onSomething: () => void;
      }

      function DispatchComp(props: DispatchProps) {
        return <div />;
      }

      expect(() => {
        const { root } = render<DispatchProps>(<DispatchComp onSomething={() => {}} />);

        // @ts-ignore
        root.dispatch('onSomething');
      }).toThrowError('Dispatching events is only allowed on host components (DOM elements).');
    });

    it('executes the function prop', () => {
      const spy = jest.fn();

      function DispatchComp() {
        return (
          <button type="button" onClick={spy}>
            Click
          </button>
        );
      }

      const { root } = render<{}>(<DispatchComp />);

      root.findOne('button').dispatch('onClick');

      expect(spy).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('dispatchAndWait()', () => {
    function DispatchTest() {
      const [count, setCount] = useState(0);
      const onClick = () =>
        runAsyncCall(() => {
          setCount(count + 1);
        });

      return (
        <div>
          <span>{count}</span>
          <button type="button" onClick={onClick}>
            Increment
          </button>
        </div>
      );
    }

    it('waits for the async and re-render', async () => {
      const { root } = render<{}>(<DispatchTest />);

      expect(root).toContainNode(0);

      await root.findOne('button').dispatchAndWait('onClick', mockSyntheticEvent('onClick'));

      expect(root).toContainNode(1);
    });
  });

  describe('find()', () => {
    it('returns an empty array if none found', () => {
      const { root } = render(<div />);

      expect(root.find('span')).toEqual([]);
    });

    it('returns all HTML elements by name', () => {
      const { root } = render(
        <div>
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </div>,
      );

      expect(root.find('span')).toHaveLength(3);
    });

    it('returns all HTML elements at any depth', () => {
      const { root } = render(
        <div>
          <span>
            1
            <span>
              2<span>3</span>
            </span>
          </span>
        </div>,
      );

      expect(root.find('span')).toHaveLength(3);
    });

    it('returns all components by type', () => {
      const { root } = render(
        <div>
          <FuncComp>1</FuncComp>
          <FuncComp>2</FuncComp>
          <FuncComp>3</FuncComp>
        </div>,
      );

      expect(root.find(FuncComp)).toHaveLength(3);
    });

    it('returns all components by type at any depth', () => {
      const { root } = render(
        <div>
          <FuncComp>
            1
            <FuncComp>
              2<FuncComp>3</FuncComp>
            </FuncComp>
          </FuncComp>
        </div>,
      );

      expect(root.find(FuncComp)).toHaveLength(3);
    });

    it('filters found elements based on defined props', () => {
      const { root } = render(
        <form>
          <input type="text" name="name" />
          <input type="email" name="email" />
          <input type="password" name="password" />
        </form>,
      );

      expect(root.find('input', { name: 'email' })).toHaveLength(1);
    });
  });

  describe('findAt()', () => {
    it('returns the element at each index', () => {
      const { root } = render(
        <div>
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </div>,
      );

      const one = root.findAt('span', 'first');
      const two = root.findAt('span', 1);
      const three = root.findAt('span', 'last');

      expect(one).toContainNode('1');
      expect(two).toContainNode('2');
      expect(three).toContainNode('3');
    });

    it('errors if unknown type passed', () => {
      const { root } = render(<div />);

      expect(() => {
        // @ts-ignore Allow invalid
        root.findAt('span', 'middle');
      }).toThrowError('Invalid index type "middle".');
    });

    it('errors if first not found', () => {
      const { root } = render(<div />);

      expect(() => {
        root.findAt('span', 'first');
      }).toThrowError('Expected to find an element at index 0 for `span`.');
    });

    it('errors if last not found', () => {
      const { root } = render(<div />);

      expect(() => {
        root.findAt('span', 'last');
      }).toThrowError('Expected to find an element at index -1 for `span`.');
    });

    it('errors if index not found', () => {
      const { root } = render(<div />);

      expect(() => {
        root.findAt('span', 3);
      }).toThrowError('Expected to find an element at index 3 for `span`.');
    });
  });

  describe('findOne()', () => {
    it('errors if no result found', () => {
      const { root } = render(<div />);

      expect(() => {
        root.findOne('span');
      }).toThrowError('Expected to find 1 element for `span`, found 0.');
    });

    it('errors if too many results found', () => {
      const { root } = render(
        <div>
          <span>1</span>
          <span>2</span>
          <span>3</span>
        </div>,
      );

      expect(() => {
        root.findOne('span');
      }).toThrowError('Expected to find 1 element for `span`, found 3.');
    });

    it('returns the HTML element found by name', () => {
      const { root } = render(
        <div>
          <span>1</span>
        </div>,
      );

      expect(root.findOne('span')).toContainNode(1);
    });

    it('returns the first component by type found by name', () => {
      const { root } = render(
        <div>
          <FuncComp>1</FuncComp>
        </div>,
      );

      expect(root.findOne(FuncComp)).toContainNode(1);
    });
  });

  describe('name()', () => {
    it('returns HTML tag', () => {
      const { root } = render(<div />);

      expect(root.name()).toBe('div');
    });

    it('returns function component name', () => {
      const { root } = render<TestProps>(<FuncComp />);

      expect(root.name()).toBe('FuncComp');
    });

    it('returns function component display name', () => {
      const { root } = render<TestProps>(<FuncCompWithDisplayName />);

      expect(root.name()).toBe('CustomFuncName');
    });

    it('returns class component name', () => {
      const { root } = render<TestProps>(<ClassComp />);

      expect(root.name()).toBe('ClassComp');
    });

    it('returns class component display name', () => {
      const { root } = render<TestProps>(<ClassCompWithDisplayName />);

      expect(root.name()).toBe('CustomCompName');
    });

    it('returns component name with HOC', () => {
      function connect<P>(WrappedComponent: React.ComponentType<P>) {
        function Connect(props: P) {
          return <WrappedComponent {...props} />;
        }

        Connect.displayName = `connect(${WrappedComponent.displayName || WrappedComponent.name})`;

        return Connect;
      }

      const Connected = connect(ClassComp);

      const { root } = render<{}>(<Connected />);

      expect(root.name()).toBe('connect(ClassComp)');
    });
  });
});
