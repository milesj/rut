import React, { useEffect, useLayoutEffect } from 'react';
import Element from '../src/Element';
import render from '../src/render';
import { ClassComp, FuncComp } from './fixtures';

describe('Renderer', () => {
  describe('root(', () => {
    it('returns an element for a host component', () => {
      const el = render(<main />).root;

      expect(el).toBeInstanceOf(Element);
      expect(el.type()).toBe('main');
    });

    it('returns an element for a class component', () => {
      const el = render(<ClassComp />).root;

      expect(el).toBeInstanceOf(Element);
      expect(el.type()).toBe(ClassComp);
    });

    it('returns an element for a function component', () => {
      const el = render(<FuncComp />).root;

      expect(el).toBeInstanceOf(Element);
      expect(el.type()).toBe(FuncComp);
    });
  });

  describe('toJSON()', () => {
    it('returns JSON for a host component', () => {
      const json = render(<main />).toJSON();

      expect(json).toEqual(expect.objectContaining({ type: 'main' }));
    });

    it('returns JSON for a class component', () => {
      const json = render(<ClassComp />).toJSON();

      expect(json).toEqual(expect.objectContaining({ type: 'div' }));
    });

    it('returns JSON for a function component', () => {
      const json = render(<FuncComp />).toJSON();

      expect(json).toEqual(expect.objectContaining({ type: 'span' }));
    });
  });

  describe('toTree()', () => {
    it('returns a tree for a host component', () => {
      const tree = render(<main />).toTree();

      expect(tree).toEqual(expect.objectContaining({ nodeType: 'host', type: 'main' }));
    });

    it('returns a tree for a class component', () => {
      const tree = render(<ClassComp />).toTree();

      expect(tree).toEqual(expect.objectContaining({ nodeType: 'component', type: ClassComp }));
    });

    it('returns a tree for a function component', () => {
      const tree = render(<FuncComp />).toTree();

      expect(tree).toEqual(expect.objectContaining({ nodeType: 'component', type: FuncComp }));
    });
  });

  describe('toString()', () => {
    it('returns name of host component', () => {
      const name = render(<main />).toString();

      expect(name).toBe('main');
    });

    it('returns name of class component', () => {
      const name = render(<ClassComp />).toString();

      expect(name).toBe('ClassComp');
    });

    it('returns name of function component', () => {
      const name = render(<FuncComp />).toString();

      expect(name).toBe('FuncComp');
    });
  });

  describe('mounting', () => {
    describe('class component', () => {
      it('triggers `componentWillMount` and `componentDidMount`', () => {
        const spy = jest.fn();

        class MountTest extends React.Component {
          UNSAFE_componentWillMount() {
            spy();
          }

          componentDidMount() {
            spy();
          }

          render() {
            return null;
          }
        }

        render(<MountTest />);

        expect(spy).toHaveBeenCalledTimes(2);
      });
    });

    describe('function component ', () => {
      it('triggers `useEffect` mount on hook', () => {
        const spy = jest.fn();

        function MountTest() {
          useEffect(spy);

          return null;
        }

        render(<MountTest />);

        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('triggers `useLayoutEffect` mount on hook', () => {
        const spy = jest.fn();

        function MountTest() {
          useLayoutEffect(spy);

          return null;
        }

        render(<MountTest />);

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('unmounting', () => {
    describe('class component', () => {
      it('triggers `componentWillUnmount`', async () => {
        const spy = jest.fn();

        class UnmountTest extends React.Component {
          componentWillUnmount() {
            spy();
          }

          render() {
            return null;
          }
        }

        const wrapper = render(<UnmountTest />);

        await wrapper.unmount();

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('function component ', () => {
      it('triggers `useEffect` unmount on hook', async () => {
        const spy = jest.fn();

        function UnmountTest() {
          useEffect(() => {
            return spy;
          });

          return null;
        }

        const wrapper = render(<UnmountTest />);

        await wrapper.unmount();

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('updating', () => {
    let count = 0;

    interface UpdateProps {
      children?: React.ReactNode;
      index?: number;
    }

    class ClassUpdateTest extends React.Component<UpdateProps> {
      render() {
        const { children } = this.props;

        count += 1;

        return children ? <div>{children}</div> : null;
      }
    }

    class PureClassUpdateTest extends React.PureComponent<UpdateProps> {
      render() {
        const { children } = this.props;

        count += 1;

        return children ? <div>{children}</div> : null;
      }
    }

    function FuncUpdateTest({ children }: UpdateProps) {
      count += 1;

      return children ? <div>{children}</div> : null;
    }

    const MemoFuncUpdateTest = React.memo(FuncUpdateTest);

    beforeEach(() => {
      count = 0;
    });

    describe('class component', () => {
      it('re-renders if props dont change', async () => {
        const wrapper = render(<ClassUpdateTest />);

        await wrapper.update();
        await wrapper.update();

        expect(count).toBe(3);
      });

      it('re-renders if props change', async () => {
        const wrapper = render(<ClassUpdateTest index={0} />);

        expect(wrapper.root.prop('index')).toBe(0);

        await wrapper.update({ index: 1 });

        expect(wrapper.root.prop('index')).toBe(1);

        await wrapper.update({ index: 2 });

        expect(wrapper.root.prop('index')).toBe(2);

        expect(count).toBe(3);
      });

      it('re-renders with a different child', async () => {
        const wrapper = render(<ClassUpdateTest>Foo</ClassUpdateTest>);

        expect(wrapper.root).toContainNode('Foo');

        const child = <div>Bar</div>;

        await wrapper.update({}, child);

        expect(wrapper.root).toContainNode(child);
      });

      it('doesnt re-render if pure and props dont change', async () => {
        const wrapper = render(<PureClassUpdateTest />);

        await wrapper.update();
        await wrapper.update();
        await wrapper.update();
        await wrapper.update();
        await wrapper.update();

        expect(count).toBe(2);
      });

      it('triggers update life cycles', async () => {
        const spy = jest.fn();

        interface Props {
          test: string;
        }

        class UpdateTest extends React.Component<Props> {
          UNSAFE_componentWillReceiveProps(nextProps: Props) {
            expect(nextProps.test).toBe('update');
            spy();
          }

          UNSAFE_componentWillUpdate(nextProps: Props) {
            expect(nextProps.test).toBe('update');
            spy();
          }

          componentDidUpdate() {
            expect(this.props.test).toBe('update');
            spy();
          }

          render() {
            return null;
          }
        }

        const wrapper = render(<UpdateTest test="mount" />);

        await wrapper.update({ test: 'update' });

        expect(spy).toHaveBeenCalledTimes(3);
      });
    });

    describe('function component', () => {
      it('re-renders if props dont change', async () => {
        const wrapper = render(<FuncUpdateTest />);

        await wrapper.update();
        await wrapper.update();

        expect(count).toBe(3);
      });

      it('re-renders if props change', async () => {
        const wrapper = render(<FuncUpdateTest index={0} />);

        expect(wrapper.root.prop('index')).toBe(0);

        await wrapper.update({ index: 1 });

        expect(wrapper.root.prop('index')).toBe(1);

        await wrapper.update({ index: 2 });

        expect(wrapper.root.prop('index')).toBe(2);

        expect(count).toBe(3);
      });

      it('re-renders with a different child', async () => {
        const wrapper = render(<FuncUpdateTest>Foo</FuncUpdateTest>);

        expect(wrapper.root).toContainNode('Foo');

        const child = <div>Bar</div>;

        await wrapper.update({}, child);

        expect(wrapper.root).toContainNode(child);
      });

      it('doesnt re-render if memoized and props dont change', async () => {
        const wrapper = render(<MemoFuncUpdateTest />);

        await wrapper.update();
        await wrapper.update();
        await wrapper.update();
        await wrapper.update();
        await wrapper.update();

        expect(count).toBe(2);
      });

      it('triggers `useEffect` each update when no cache', async () => {
        const spy = jest.fn();

        interface Props {
          test: string;
        }

        function UpdateTest({ test }: Props) {
          useEffect(spy);

          return null;
        }

        const wrapper = render(<UpdateTest test="update" />);

        await wrapper.update({ test: 'update' });
        await wrapper.update({ test: 'update' });

        expect(spy).toHaveBeenCalledTimes(3);
      });

      it('triggers `useEffect` each update with caching and props change', async () => {
        const spy = jest.fn();

        interface Props {
          test: string;
        }

        function UpdateTest({ test }: Props) {
          useEffect(spy, [test]);

          return null;
        }

        const wrapper = render(<UpdateTest test="mount" />);

        await wrapper.update({ test: 'mount' });
        await wrapper.update({ test: 'update' });
        await wrapper.update({ test: 'update' });

        expect(spy).toHaveBeenCalledTimes(2);
      });
    });
  });
});
