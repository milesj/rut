import React from 'react';
import { render } from '../../src/render';
import { ClassComp, FuncComp, TestProps } from '../fixtures';

describe('debug', () => {
  it('adds key and ref props first', async () => {
    const ref = React.createRef<ClassComp>();
    const result = await render<TestProps>(<ClassComp key={123} ref={ref} name="test" />);

    expect(result).toMatchSnapshot();

    // Without
    expect(result.debug({ keyAndRef: false, log: false })).toMatchSnapshot();
  });

  it('sorts props, and groups into: true first, everything else, event handlers last', async () => {
    interface SortOrderProps {
      enabled: boolean;
      selected: boolean;
      name: string;
      content: React.ReactNode;
      onClick?: () => void;
      onDelete?: () => void;
      onUpdate?: () => void;
    }

    function SortOrder(props: SortOrderProps) {
      return <div />;
    }

    const result = await render<SortOrderProps>(
      <SortOrder
        // Wont show up since its a function component
        key="key"
        onClick={jest.fn()}
        selected={false}
        name="Rut"
        content={<div>Content</div>}
        enabled
        onUpdate={jest.fn()}
      />,
    );

    expect(result).toMatchSnapshot();

    // Not grouped
    expect(result.debug({ groupProps: false, log: false })).toMatchSnapshot();

    // Not sorted
    expect(result.debug({ log: false, sortProps: false })).toMatchSnapshot();

    // Not both
    expect(result.debug({ groupProps: false, log: false, sortProps: false })).toMatchSnapshot();
  });

  it('formats array props', async () => {
    function ArrayProp(props: { list: unknown[] }) {
      return <ul />;
    }

    const result = await render<{}>(<ArrayProp list={['string', 123, true, null, {}, []]} />);

    expect(result).toMatchSnapshot();

    // Test long and complex arrays + objects
    result.update({
      list: [
        { id: 1, name: 'Bruce Wayne' },
        { id: 2, name: 'Clark Kent' },
        { id: 3, name: 'Barry Allen' },
        { id: 4, name: 'Tony Stark' },
        { id: 5, name: 'Steve Rogers' },
        { id: 6, name: 'Bruce Banner' },
      ],
    });

    expect(result).toMatchSnapshot();
  });

  it('formats object props', async () => {
    function ObjectProp(props: { data: unknown }) {
      return <div />;
    }

    const result = await render<{}>(
      <ObjectProp data={{ id: 1, name: 'Bruce Wayne', alias: 'Batman', age: 40 }} />,
    );

    expect(result).toMatchSnapshot();
  });

  it('formats regex props', async () => {
    function RegexProp(props: { pattern: RegExp }) {
      return <div />;
    }

    const result = await render<{}>(<RegexProp pattern={/foo|bar|baz/u} />);

    expect(result).toMatchSnapshot();
  });

  it('formats map props', async () => {
    function MapProp(props: { map: Map<string, number> }) {
      return <div />;
    }

    const result = await render<{}>(
      <MapProp map={new Map([['foo', 123], ['bar', 456], ['baz', 789]])} />,
    );

    expect(result).toMatchSnapshot();
  });

  it('formats set props', async () => {
    function SetProp(props: { set: Set<string> }) {
      return <div />;
    }

    const result = await render<{}>(<SetProp set={new Set(['foo', 'bar', 'foo', 'baz'])} />);

    expect(result).toMatchSnapshot();
  });

  it('formats function and class instance props', async () => {
    function funcName() {}
    class ClassName {}

    interface FuncPropProps {
      func: () => void;
      inst: ClassName;
    }

    function FuncProp(props: FuncPropProps) {
      return <div />;
    }

    const result = await render<FuncPropProps>(<FuncProp func={funcName} inst={new ClassName()} />);

    expect(result).toMatchSnapshot();
  });

  it('doesnt render children', async () => {
    interface ChildCompProps {
      children: React.ReactNode;
      foo?: string;
      bar?: number;
      baz?: boolean;
    }

    function ChildComp({ children }: ChildCompProps) {
      return <div>{children}</div>;
    }

    const { debug } = await render<ChildCompProps>(
      <ChildComp foo="abc" bar={123} baz>
        <div>Child should not be rendered.</div>
      </ChildComp>,
    );

    expect(debug({ children: false, log: false })).toMatchSnapshot();
  });

  describe('element output', () => {
    function Header() {
      return (
        <div>
          <header id="header">
            <h1>Title</h1>
            <p>Description!</p>
          </header>
        </div>
      );
    }

    function Outer() {
      return (
        <main role="main">
          <Header />
          <section>
            Description.
            <FuncComp />
          </section>
        </main>
      );
    }

    it('renders normal', async () => {
      const { debug } = await render<{}>(<Outer />);

      expect(debug({ log: false })).toMatchSnapshot();
    });

    it('hides DOM output', async () => {
      const { debug } = await render<{}>(<Outer />);

      expect(debug({ hostElements: false, log: false })).toMatchSnapshot();
    });

    it('hides React output', async () => {
      const { debug } = await render<{}>(<Outer />);

      expect(debug({ reactElements: false, log: false })).toMatchSnapshot();
    });
  });
});
