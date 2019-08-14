import React, { useEffect } from 'react';
import Node from '../src/Node';
import render from '../src/render';

describe('Renderer', () => {
  class ClassComp extends React.Component<{ foo?: string }> {
    render() {
      return <div />;
    }
  }

  function FuncComp(props: { bar?: number }) {
    return <section />;
  }

  describe('root()', () => {
    it('returns a node for a host component', () => {
      const node = render(<main />).root();

      expect(node).toBeInstanceOf(Node);
      expect(node.type()).toBe('main');
    });

    it('returns a node for a class component', () => {
      const node = render(<ClassComp />).root();

      expect(node).toBeInstanceOf(Node);
      expect(node.type()).toBe(ClassComp);
    });

    it('returns a node for a function component', () => {
      const node = render(<FuncComp />).root();

      expect(node).toBeInstanceOf(Node);
      expect(node.type()).toBe(FuncComp);
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

      expect(json).toEqual(expect.objectContaining({ type: 'section' }));
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

  describe('unmount()', () => {
    describe('class component', () => {
      it('triggers `componentWillUnmount`', async () => {
        expect.assertions(1);

        class UnmountTest extends React.Component {
          componentWillUnmount() {
            expect(1).toBe(1);
          }

          render() {
            return null;
          }
        }

        const wrapper = render(<UnmountTest />);

        await wrapper.unmount();
      });
    });

    describe('function component ', () => {
      it('triggers `useEffect` unmount on hook', async () => {
        expect.assertions(1);

        function UnmountTest() {
          useEffect(() => {
            return () => {
              expect(1).toBe(1);
            };
          });

          return null;
        }

        const wrapper = render(<UnmountTest />);

        await wrapper.unmount();
      });
    });
  });

  describe('update()', () => {
    let count = 0;

    class ClassUpdateTest extends React.Component<{ index?: number }> {
      render() {
        count += 1;

        return null;
      }
    }

    function FuncUpdateTest(props: { index?: number }) {
      count += 1;

      return null;
    }

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

        expect(wrapper.root().prop('index')).toBe(0);

        await wrapper.update({ index: 1 });

        expect(wrapper.root().prop('index')).toBe(1);

        await wrapper.update({ index: 2 });

        expect(wrapper.root().prop('index')).toBe(2);

        expect(count).toBe(3);
      });

      it('triggers update life cycles', async () => {
        expect.assertions(3);

        interface Props {
          test: string;
        }

        class UpdateTest extends React.Component<Props> {
          UNSAFE_componentWillReceiveProps(nextProps: Props) {
            expect(nextProps.test).toBe('update');
          }

          UNSAFE_componentWillUpdate(nextProps: Props) {
            expect(nextProps.test).toBe('update');
          }

          componentDidUpdate() {
            expect(this.props.test).toBe('update');
          }

          render() {
            return null;
          }
        }

        const wrapper = render(<UpdateTest test="mount" />);

        await wrapper.update({ test: 'update' });
      });
    });

    describe('function component', () => {
      it('re-renders if props change', async () => {
        const wrapper = render(<FuncUpdateTest index={0} />);

        expect(wrapper.root().prop('index')).toBe(0);

        await wrapper.update({ index: 1 });

        expect(wrapper.root().prop('index')).toBe(1);

        await wrapper.update({ index: 2 });

        expect(wrapper.root().prop('index')).toBe(2);

        expect(count).toBe(3);
      });

      it('triggers `useEffect` each update when no cache', async () => {
        expect.assertions(3);

        interface Props {
          test: string;
        }

        function UpdateTest({ test }: Props) {
          useEffect(() => {
            expect(test).toBe('update');
          });

          return null;
        }

        const wrapper = render(<UpdateTest test="update" />);

        await wrapper.update({ test: 'update' });
        await wrapper.update({ test: 'update' });
      });

      it('triggers `useEffect` each update with caching and props change', async () => {
        expect.assertions(2);

        interface Props {
          test: string;
        }

        function UpdateTest({ test }: Props) {
          useEffect(() => {
            expect(1).toBe(1);
          }, [test]);

          return null;
        }

        const wrapper = render(<UpdateTest test="mount" />);

        await wrapper.update({ test: 'mount' });
        await wrapper.update({ test: 'update' });
        await wrapper.update({ test: 'update' });
      });
    });
  });
});
