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
  TestProps,
  AsyncProps,
} from './fixtures';

describe('Result', () => {
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

  it('can serialize as a snapshot', async () => {
    const result = await render<TestProps>(
      <FuncComp>
        <b>Child</b>
      </FuncComp>,
    );

    expect(result).toMatchSnapshot();
  });

  it('wraps with `StrictMode` when using `strict`', async () => {
    class StrictComp extends React.Component {
      componentWillMount() {
        // Logs a warning to be UNSAFE
      }

      render() {
        return null;
      }
    }

    const result = await render<{}>(<StrictComp />, { strict: true });

    expect(result).toMatchSnapshot();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('componentWillMount has been renamed'),
    );
  });

  it('wraps with another element when using `wrapper`', async () => {
    function ContextComp() {
      const value = useContext(TestContext);

      return <div>{value}</div>;
    }

    const result = await render<{}>(<ContextComp />, { wrapper: <Wrapper /> });

    expect(result).toMatchSnapshot();
    expect(result.debug({ log: false })).toContain('<Wrapper>');
    expect(result.root).toContainNode('wrapped');
  });

  it('wraps with both `strict` and `wrapper`', async () => {
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

    const result = await render<{}>(<Wrapped />, { strict: true, wrapper: <Wrapper /> });

    expect(result).toMatchSnapshot();
    expect(result.debug({ log: false })).toContain('<Wrapper>');
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('componentWillReceiveProps has been renamed'),
    );
  });

  it.skip('catches and rethrows errors', () => {
    // React logs when an error is thrown without a boundary
    const spy = jest.spyOn(console, 'error');

    function ErrorComp({ fail }: { fail: boolean }) {
      if (fail) {
        throw new Error('Failed for some reason...');
      }

      return null;
    }

    expect(async () => {
      await render<{}>(<ErrorComp fail />);
    }).toThrowError('Failed for some reason...');

    expect(spy).not.toHaveBeenCalled();
  });

  describe('root()', () => {
    it('returns an element for a host component', async () => {
      const { root } = await render(<main />);

      expect(root).toBeInstanceOf(Element);
      expect(root).toBeElementType('main');
    });

    it('returns an element for a class component', async () => {
      const { root } = await render<TestProps>(<ClassComp />);

      expect(root).toBeInstanceOf(Element);
      expect(root).toBeElementType(ClassComp);
    });

    it('returns an element for a function component', async () => {
      const { root } = await render<TestProps>(<FuncComp />);

      expect(root).toBeInstanceOf(Element);
      expect(root).toBeElementType(FuncComp);
    });

    it('returns the passed element when using `strict`', async () => {
      const { root } = await render<TestProps>(<FuncComp />, { strict: true });

      expect(root).toBeInstanceOf(Element);
      expect(root).toBeElementType(FuncComp);
    });

    it('returns the passed element when using `wrapper`', async () => {
      const { root } = await render<TestProps>(<FuncComp />, { wrapper: <Wrapper /> });

      expect(root).toBeInstanceOf(Element);
      expect(root).toBeElementType(FuncComp);
    });

    it('returns the passed memoized element when using `wrapper`', async () => {
      const Root = React.memo(FuncComp);
      const { root } = await render<TestProps>(<Root />, { wrapper: <Wrapper /> });

      expect(root).toBeInstanceOf(Element);
      expect(root).toBeElementType(FuncComp);
    });

    it('returns the passed element when using `strict` and `wrapper`', async () => {
      const { root } = await render<TestProps>(<FuncComp />, {
        strict: true,
        wrapper: <Wrapper />,
      });

      expect(root).toBeInstanceOf(Element);
      expect(root).toBeElementType(FuncComp);
    });
  });

  describe('toJSON()', () => {
    it('returns JSON for a host component', async () => {
      const json = (await render(<main />)).toJSON();

      expect(json).toEqual(expect.objectContaining({ type: 'main' }));
    });

    it('returns JSON for a class component', async () => {
      const json = (await render<TestProps>(<ClassComp />)).toJSON();

      expect(json).toEqual(expect.objectContaining({ type: 'div' }));
    });

    it('returns JSON for a function component', async () => {
      const json = (await render<TestProps>(<FuncComp />)).toJSON();

      expect(json).toEqual(expect.objectContaining({ type: 'span' }));
    });
  });

  describe('toTree()', () => {
    it('returns a tree for a host component', async () => {
      const tree = (await render(<main />)).toTree();

      expect(tree).toEqual(expect.objectContaining({ nodeType: 'host', type: 'main' }));
    });

    it('returns a tree for a class component', async () => {
      const tree = (await render<TestProps>(<ClassComp />)).toTree();

      expect(tree).toEqual(expect.objectContaining({ nodeType: 'component', type: ClassComp }));
    });

    it('returns a tree for a function component', async () => {
      const tree = (await render<TestProps>(<FuncComp />)).toTree();

      expect(tree).toEqual(expect.objectContaining({ nodeType: 'component', type: FuncComp }));
    });
  });

  describe('toString()', () => {
    it('returns name of host component', async () => {
      const name = (await render(<main />)).toString();

      expect(name).toBe('<main />');
    });

    it('returns name of class component', async () => {
      const name = (await render<TestProps>(<ClassComp />)).toString();

      expect(name).toBe('<ClassComp />');
    });

    it('returns name of function component', async () => {
      const name = (await render<TestProps>(<FuncComp />)).toString();

      expect(name).toBe('<FuncComp />');
    });
  });

  describe('mounting', () => {
    describe('class component', () => {
      it('triggers `componentWillMount` and `componentDidMount`', async () => {
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

        await render<{}>(<MountTest />);

        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('supports async `componentDidMount`', async () => {
        const spy = jest.fn();

        const { root } = await renderAndWait<AsyncProps>(<AsyncCdmComp onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(root).toContainNode('Loaded');
      });

      it('supports `componentDidMount` with timers', async () => {
        const spy = jest.fn();

        const { root } = await renderAndWait<AsyncProps>(<TimerCdmComp onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(root).toContainNode('Loaded');
      });
    });

    describe('function component ', () => {
      it('triggers `useEffect` mount on hook', async () => {
        const spy = jest.fn();

        function MountTest() {
          useEffect(spy);

          return null;
        }

        await render<{}>(<MountTest />);

        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('triggers `useLayoutEffect` mount on hook', async () => {
        const spy = jest.fn();

        function MountTest() {
          useLayoutEffect(spy);

          return null;
        }

        await render<{}>(<MountTest />);

        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('supports async `useEffect`', async () => {
        const spy = jest.fn();

        const { root } = await renderAndWait<AsyncProps>(<AsyncHookComp onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(root).toContainNode('Loaded');
      });

      it('supports `useEffect` with timers', async () => {
        const spy = jest.fn();

        const { root } = await renderAndWait<AsyncProps>(<TimerHookComp onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(root).toContainNode('Loaded');
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

        const result = await render<{}>(<UnmountTest />);

        result.unmount();

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

        const result = await render<{}>(<UnmountTest />);

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

    it('when using `strict`, re-renders the passed element', async () => {
      const result = await render<TestProps>(<FuncComp name="mount" />, { strict: true });

      expect(result).toMatchSnapshot();
      expect(result.root).toHaveProp('name', 'mount');

      result.update({ name: 'update' });

      expect(result).toMatchSnapshot();
      expect(result.root).toHaveProp('name', 'update');
    });

    it('when using `wrapper`, re-renders the passed element', async () => {
      const result = await render<TestProps>(<FuncComp name="mount" />, { wrapper: <Wrapper /> });

      expect(result).toMatchSnapshot();
      expect(result.root).toHaveProp('name', 'mount');

      result.update({ name: 'update' });

      expect(result).toMatchSnapshot();
      expect(result.root).toHaveProp('name', 'update');
    });

    it('when using `strict` and `wrapper`, re-renders the passed element', async () => {
      const result = await render<TestProps>(<FuncComp name="mount" />, {
        strict: true,
        wrapper: <Wrapper />,
      });

      expect(result).toMatchSnapshot();
      expect(result.root).toHaveProp('name', 'mount');

      result.update({ name: 'update' });

      expect(result).toMatchSnapshot();
      expect(result.root).toHaveProp('name', 'update');
    });

    describe('class component', () => {
      it('re-renders if props dont change', async () => {
        const result = await render<UpdateProps>(<ClassUpdateTest />);

        result.update();
        result.update();

        expect(count).toBe(3);
      });

      it('re-renders if props change', async () => {
        const result = await render<UpdateProps>(<ClassUpdateTest index={0} />);

        expect(result.root).toHaveProp('index', 0);

        result.update({ index: 1 });

        expect(result.root).toHaveProp('index', 1);

        result.update({ index: 2 });

        expect(result.root).toHaveProp('index', 2);

        expect(count).toBe(3);
      });

      it('re-renders with a different child', async () => {
        const result = await render<UpdateProps>(<ClassUpdateTest>Foo</ClassUpdateTest>);

        expect(result.root).toContainNode('Foo');

        const child = <div>Bar</div>;

        result.update({}, child);

        expect(result.root).toContainNode(child);
      });

      it('doesnt re-render if pure and props dont change', async () => {
        const result = await render<UpdateProps>(<PureClassUpdateTest />);

        result.update();
        result.update();
        result.update();
        result.update();
        result.update();

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

        const result = await render<Props>(<UpdateTest test="mount" />);

        result.update({ test: 'update' });

        expect(spy).toHaveBeenCalledTimes(3);
      });

      it('supports async `componentDidUpdate`', async () => {
        const spy = jest.fn();

        const result = await render<AsyncProps>(<AsyncCduComp id="first" onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(result.root).toContainNode('Loading...');

        await result.updateAndWait({ id: 'second' });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result.root).toContainNode('Loaded');
      });

      it('supports `componentDidUpdate` with timers', async () => {
        const spy = jest.fn();

        const result = await render<AsyncProps>(<TimerCduComp id="first" onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(result.root).toContainNode('Loading...');

        await result.updateAndWait({ id: 'second' });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result.root).toContainNode('Loaded');
      });
    });

    describe('function component', () => {
      it('re-renders if props dont change', async () => {
        const result = await render<UpdateProps>(<FuncUpdateTest />);

        result.update();
        result.update();

        expect(count).toBe(3);
      });

      it('re-renders if props change', async () => {
        const result = await render<UpdateProps>(<FuncUpdateTest index={0} />);

        expect(result.root).toHaveProp('index', 0);

        result.update({ index: 1 });

        expect(result.root).toHaveProp('index', 1);

        result.update({ index: 2 });

        expect(result.root).toHaveProp('index', 2);

        expect(count).toBe(3);
      });

      it('re-renders with a different child', async () => {
        const result = await render<UpdateProps>(<FuncUpdateTest>Foo</FuncUpdateTest>);

        expect(result.root).toContainNode('Foo');

        const child = <div>Bar</div>;

        result.update({}, child);

        expect(result.root).toContainNode(child);
      });

      it('doesnt re-render if memoized and props dont change', async () => {
        const result = await render<UpdateProps>(<MemoFuncUpdateTest />);

        result.update();
        result.update();
        result.update();
        result.update();
        result.update();

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

        const result = await render<Props>(<UpdateTest test="update" />);

        result.update({ test: 'update' });
        result.update({ test: 'update' });

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

        const result = await render<Props>(<UpdateTest test="mount" />);

        result.update({ test: 'mount' });
        result.update({ test: 'update' });
        result.update({ test: 'update' });

        expect(spy).toHaveBeenCalledTimes(2);
      });

      it('supports async `useEffect`', async () => {
        const spy = jest.fn();

        const result = await render<AsyncProps>(<AsyncHookComp id="first" onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(result.root).toContainNode('Loading...');

        await result.updateAndWait({ id: 'second' });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result.root).toContainNode('Loaded');
      });

      it('supports `useEffect` with timers', async () => {
        const spy = jest.fn();

        const result = await render<AsyncProps>(<AsyncHookComp id="first" onLoad={spy} />);

        expect(spy).toHaveBeenCalledTimes(0);
        expect(result.root).toContainNode('Loading...');

        await result.updateAndWait({ id: 'second' });

        expect(spy).toHaveBeenCalledTimes(1);
        expect(result.root).toContainNode('Loaded');
      });
    });
  });

  describe('re-rendering', () => {
    it('can create multiple root elements (assigned to different vars)', async () => {
      const { root, rerenderAndWait } = await render(<div />);
      const spanRoot = await rerenderAndWait(<span />);
      const sectionRoot = await rerenderAndWait(<section />);

      expect(spanRoot).not.toBe(root);
      expect(sectionRoot).not.toBe(root);
      expect(sectionRoot).toBeElementType('section');
    });

    it('can update the wrapper', async () => {
      const result = await render(<div />, {
        wrapper: <div id="first" />,
      });

      const out1 = result.debug({ log: false });

      expect(out1).toMatchSnapshot();

      await result.rerenderAndWait(<span />, {
        wrapper: <section id="second" />,
      });

      const out2 = result.debug({ log: false });

      expect(out2).toMatchSnapshot();
      expect(out1).not.toBe(out2);
    });

    describe('sync', () => {
      it('can replace the root element', async () => {
        const { root, rerenderAndWait } = await render(<div />);

        expect(root).toBeElementType('div');

        const newRoot = await rerenderAndWait(<span />);

        expect(newRoot).toBeElementType('span');
      });

      it('can reuse the root on the result', async () => {
        const result = await render(<div />);

        expect(result.root).toBeElementType('div');

        await result.rerenderAndWait(<span />);

        expect(result.root).toBeElementType('span');
      });
    });

    describe('async', () => {
      it('can replace the root element', async () => {
        const { root, rerenderAndWait } = await renderAndWait(<div />);

        expect(root).toBeElementType('div');

        const newRoot = await rerenderAndWait(<span />);

        expect(newRoot).toBeElementType('span');
      });

      it('can reuse the root on the result', async () => {
        const result = await renderAndWait(<div />);

        expect(result.root).toBeElementType('div');

        await result.rerenderAndWait(<span />);

        expect(result.root).toBeElementType('span');
      });
    });
  });
});
