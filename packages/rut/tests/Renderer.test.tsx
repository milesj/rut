import React, { useEffect, useLayoutEffect, useContext } from 'react';
import Element from '../src/Element';
import { render, renderAndWait } from '../src/render';
import {
  ClassComp,
  FuncComp,
  TestContext,
  AsyncHookComp,
  AsyncCdmComp,
  AsyncCduComp,
  TimerCdmComp,
  TimerHookComp,
  TimerCduComp,
} from './fixtures';

describe('Renderer', () => {
  const oldWarn = console.warn;
  let warnSpy: jest.Mock;

  beforeEach(() => {
    warnSpy = jest.fn();
    console.warn = warnSpy;
  });

  afterEach(() => {
    console.warn = oldWarn;
  });

  function Wrapper({ children }: { children?: React.ReactNode }) {
    return <TestContext.Provider value="wrapped">{children || null}</TestContext.Provider>;
  }

  it('wraps with `StrictMode` when using `strict`', () => {
    class StrictComp extends React.Component {
      componentWillMount() {
        // Logs a warning to be UNSAFE
      }

      render() {
        return null;
      }
    }

    const result = render(<StrictComp />, { strict: true });

    expect(result).toMatchSnapshot();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('componentWillMount has been renamed'),
    );
  });

  it('wraps with another element when using `wrapper`', () => {
    function ContextComp() {
      const value = useContext(TestContext);

      return <div>{value}</div>;
    }

    const result = render(<ContextComp />, { wrapper: <Wrapper /> });

    expect(result).toMatchSnapshot();
    expect(result.debug(true)).toContain('<Wrapper>');
    expect(result.root).toContainNode('wrapped');
  });

  it('wraps with both `strict` and `wrapper`', () => {
    class StrictComp extends React.Component {
      componentWillReceiveProps() {
        // Logs a warning to be UNSAFE
      }

      render() {
        return null;
      }
    }

    function Wrapped() {
      return (
        <div>
          <StrictComp />
        </div>
      );
    }

    const result = render(<Wrapped />, { strict: true, wrapper: <Wrapper /> });

    expect(result).toMatchSnapshot();
    expect(result.debug(true)).toContain('<Wrapper>');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('componentWillReceiveProps has been renamed'),
    );
  });

  describe('root()', () => {
    it('returns an element for a host component', () => {
      const { root } = render(<main />);

      expect(root).toBeInstanceOf(Element);
      expect(root.type()).toBe('main');
    });

    it('returns an element for a class component', () => {
      const { root } = render(<ClassComp />);

      expect(root).toBeInstanceOf(Element);
      expect(root.type()).toBe(ClassComp);
    });

    it('returns an element for a function component', () => {
      const { root } = render(<FuncComp />);

      expect(root).toBeInstanceOf(Element);
      expect(root.type()).toBe(FuncComp);
    });

    it('returns the passed element when using `strict`', () => {
      const { root } = render(<FuncComp />, { strict: true });

      expect(root).toBeInstanceOf(Element);
      expect(root.type()).toBe(FuncComp);
    });

    it('returns the passed element when using `wrapper`', () => {
      const { root } = render(<FuncComp />, { wrapper: <Wrapper /> });

      expect(root).toBeInstanceOf(Element);
      expect(root.type()).toBe(FuncComp);
    });

    it('returns the passed memoized element when using `wrapper`', () => {
      const Root = React.memo(FuncComp);
      const { root } = render(<Root />, { wrapper: <Wrapper /> });

      expect(root).toBeInstanceOf(Element);
      expect(root.type()).toBe(FuncComp);
    });

    it('returns the passed element when using `strict` and `wrapper`', () => {
      const { root } = render(<FuncComp />, { strict: true, wrapper: <Wrapper /> });

      expect(root).toBeInstanceOf(Element);
      expect(root.type()).toBe(FuncComp);
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

      it('supports async `componentDidMount`', async () => {
        const spy = jest.fn();

        const { root } = await renderAndWait(<AsyncCdmComp onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(root).toContainNode('Loaded');
      });

      it('supports `componentDidMount` with timers', async () => {
        const spy = jest.fn();

        const { root } = await renderAndWait(<TimerCdmComp onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(root).toContainNode('Loaded');
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

      it('supports async `useEffect`', async () => {
        const spy = jest.fn();

        const { root } = await renderAndWait(<AsyncHookComp onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(root).toContainNode('Loaded');
      });

      it('supports `useEffect` with timers', async () => {
        const spy = jest.fn();

        const { root } = await renderAndWait(<TimerHookComp onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(root).toContainNode('Loaded');
      });
    });
  });

  describe('unmounting', () => {
    describe('class component', () => {
      it('triggers `componentWillUnmount`', () => {
        const spy = jest.fn();

        class UnmountTest extends React.Component {
          componentWillUnmount() {
            spy();
          }

          render() {
            return null;
          }
        }

        const result = render(<UnmountTest />);

        result.unmount();

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('function component ', () => {
      it('triggers `useEffect` unmount on hook', () => {
        const spy = jest.fn();

        function UnmountTest() {
          useEffect(() => {
            return spy;
          });

          return null;
        }

        const result = render(<UnmountTest />);

        result.unmount();

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

    it('when using `strict`, re-renders the passed element', () => {
      const result = render(<FuncComp name="mount" />, { strict: true });

      expect(result).toMatchSnapshot();
      expect(result.root.prop('name')).toBe('mount');

      result.update({ name: 'update' });

      expect(result).toMatchSnapshot();
      expect(result.root.prop('name')).toBe('update');
    });

    it('when using `wrapper`, re-renders the passed element', () => {
      const result = render(<FuncComp name="mount" />, { wrapper: <Wrapper /> });

      expect(result).toMatchSnapshot();
      expect(result.root.prop('name')).toBe('mount');

      result.update({ name: 'update' });

      expect(result).toMatchSnapshot();
      expect(result.root.prop('name')).toBe('update');
    });

    it('when using `strict` and `wrapper`, re-renders the passed element', () => {
      const result = render(<FuncComp name="mount" />, { strict: true, wrapper: <Wrapper /> });

      expect(result).toMatchSnapshot();
      expect(result.root.prop('name')).toBe('mount');

      result.update({ name: 'update' });

      expect(result).toMatchSnapshot();
      expect(result.root.prop('name')).toBe('update');
    });

    it('can completely replace the root element', () => {
      const result = render(<div />);

      expect(result.root).toBeElementType('div');

      result.update(<span />);

      expect(result.root).toBeElementType('span');
    });

    describe('class component', () => {
      it('re-renders if props dont change', () => {
        const result = render(<ClassUpdateTest />);

        result.update();
        result.update();

        expect(count).toBe(3);
      });

      it('re-renders if props change', () => {
        const result = render(<ClassUpdateTest index={0} />);

        expect(result.root.prop('index')).toBe(0);

        result.update({ index: 1 });

        expect(result.root.prop('index')).toBe(1);

        result.update({ index: 2 });

        expect(result.root.prop('index')).toBe(2);

        expect(count).toBe(3);
      });

      it('re-renders with a different child', () => {
        const result = render(<ClassUpdateTest>Foo</ClassUpdateTest>);

        expect(result.root).toContainNode('Foo');

        const child = <div>Bar</div>;

        result.update({}, child);

        expect(result.root).toContainNode(child);
      });

      it('doesnt re-render if pure and props dont change', () => {
        const result = render(<PureClassUpdateTest />);

        result.update();
        result.update();
        result.update();
        result.update();
        result.update();

        expect(count).toBe(2);
      });

      it('triggers update life cycles', () => {
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

        const result = render(<UpdateTest test="mount" />);

        result.update({ test: 'update' });

        expect(spy).toHaveBeenCalledTimes(3);
      });

      it('supports async `componentDidUpdate`', async () => {
        const spy = jest.fn();

        const result = render(<AsyncCduComp id="first" onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(result.root).toContainNode('Loading...');

        await result.updateAndWait({ id: 'second' });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result.root).toContainNode('Loaded');
      });

      it('supports `componentDidUpdate` with timers', async () => {
        const spy = jest.fn();

        const result = render(<TimerCduComp id="first" onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(result.root).toContainNode('Loading...');

        await result.updateAndWait({ id: 'second' });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result.root).toContainNode('Loaded');
      });
    });

    describe('function component', () => {
      it('re-renders if props dont change', () => {
        const result = render(<FuncUpdateTest />);

        result.update();
        result.update();

        expect(count).toBe(3);
      });

      it('re-renders if props change', () => {
        const result = render(<FuncUpdateTest index={0} />);

        expect(result.root.prop('index')).toBe(0);

        result.update({ index: 1 });

        expect(result.root.prop('index')).toBe(1);

        result.update({ index: 2 });

        expect(result.root.prop('index')).toBe(2);

        expect(count).toBe(3);
      });

      it('re-renders with a different child', () => {
        const result = render(<FuncUpdateTest>Foo</FuncUpdateTest>);

        expect(result.root).toContainNode('Foo');

        const child = <div>Bar</div>;

        result.update({}, child);

        expect(result.root).toContainNode(child);
      });

      it('doesnt re-render if memoized and props dont change', () => {
        const result = render(<MemoFuncUpdateTest />);

        result.update();
        result.update();
        result.update();
        result.update();
        result.update();

        expect(count).toBe(2);
      });

      it('triggers `useEffect` each update when no cache', () => {
        const spy = jest.fn();

        interface Props {
          test: string;
        }

        function UpdateTest({ test }: Props) {
          useEffect(spy);

          return null;
        }

        const result = render(<UpdateTest test="update" />);

        result.update({ test: 'update' });
        result.update({ test: 'update' });

        expect(spy).toHaveBeenCalledTimes(3);
      });

      it('triggers `useEffect` each update with caching and props change', () => {
        const spy = jest.fn();

        interface Props {
          test: string;
        }

        function UpdateTest({ test }: Props) {
          useEffect(spy, [test]);

          return null;
        }

        const result = render(<UpdateTest test="mount" />);

        result.update({ test: 'mount' });
        result.update({ test: 'update' });
        result.update({ test: 'update' });

        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('supports async `useEffect`', async () => {
        const spy = jest.fn();

        const result = render(<AsyncHookComp id="first" onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(result.root).toContainNode('Loading...');

        await result.updateAndWait({ id: 'second' });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result.root).toContainNode('Loaded');
      });

      it('supports `useEffect` with timers', async () => {
        const spy = jest.fn();

        const result = render(<AsyncHookComp id="first" onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(result.root).toContainNode('Loading...');

        await result.updateAndWait({ id: 'second' });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result.root).toContainNode('Loaded');
      });
    });
  });
});
