import React, { useState } from 'react';
import Element from '../src/Element';
import { render } from '../src/render';
import { mockSyntheticEvent } from '../src/mocks/event';
import { FuncComp, FuncCompWithDisplayName, ClassComp, ClassCompWithDisplayName } from './fixtures';
import { runAsyncCall } from './helpers';

describe('Element', () => {
  describe('children()', () => {
    it('returns an empty array when no children (null return)', () => {
      function NullComp() {
        return null;
      }

      const { root } = render(<NullComp />);

      expect(root.children()).toEqual([]);
    });

    it('returns as strings and elements', () => {
      function StringComp() {
        return (
          <div>
            Foo
            <br />
            Bar
          </div>
        );
      }

      const { root } = render(<StringComp />);

      expect(root.findOne('div').children()).toEqual(['Foo', expect.any(Element), 'Bar']);
    });
  });

  describe('debug()', () => {
    it('debugs based on element depth', () => {
      const { root } = render(
        <div>
          <section>
            <article>
              <h1>Title</h1>
            </article>
          </section>
        </div>,
      );

      expect(root.debug({ return: true })).toMatchSnapshot();
      expect(root.findOne('section').debug({ return: true })).toMatchSnapshot();
      expect(root.findOne('h1').debug({ return: true })).toMatchSnapshot();
    });
  });

  describe('emit()', () => {
    it('errors if prop does not exist', () => {
      expect(() => {
        const { root } = render(
          <div>
            <span />
          </div>,
        );

        // @ts-ignore
        root.findOne('span').emit('onFake');
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
        root.findOne('span').emit('id');
      }).toThrowError('Prop `id` is not a function.');
    });

    it('errors if emitting on a non-host component', () => {
      function EmitComp(props: { onSomething: () => void }) {
        return <div />;
      }

      expect(() => {
        const { root } = render(<EmitComp onSomething={() => {}} />);

        root.emit('onSomething');
      }).toThrowError('Emitting events is only allowed on host components (DOM elements).');
    });

    it('executes the function prop', () => {
      const spy = jest.fn();

      function EmitComp() {
        return (
          <button type="button" onClick={spy}>
            Click
          </button>
        );
      }

      const { root } = render(<EmitComp />);

      root.findOne('button').emit('onClick', {}, mockSyntheticEvent('click'));

      expect(spy).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('emitAndWait()', () => {
    function EmitTest() {
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
      const { root } = render(<EmitTest />);

      expect(root).toContainNode(0);

      await root.findOne('button').emitAndWait('onClick', {}, mockSyntheticEvent('click'));

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
      const { root } = render(<FuncComp />);

      expect(root.name()).toBe('FuncComp');
    });

    it('returns function component display name', () => {
      const { root } = render(<FuncCompWithDisplayName />);

      expect(root.name()).toBe('CustomFuncName');
    });

    it('returns class component name', () => {
      const { root } = render(<ClassComp />);

      expect(root.name()).toBe('ClassComp');
    });

    it('returns class component display name', () => {
      const { root } = render(<ClassCompWithDisplayName />);

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

      const { root } = render(<Connected />);

      expect(root.name()).toBe('connect(ClassComp)');
    });
  });
});
