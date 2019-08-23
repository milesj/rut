import React from 'react';
import { render } from '../src/render';
import { ClassComp } from './fixtures';

describe('debug()', () => {
  it('adds key and ref props first', () => {
    const ref = React.createRef<ClassComp>();
    const result = render(<ClassComp key={123} ref={ref} name="test" />);

    expect(result).toMatchSnapshot();
  });

  it('sorts props, and groups into: true first, everything else, event handlers last', () => {
    function SortProps(props: {
      enabled: boolean;
      selected: boolean;
      name: string;
      content: React.ReactNode;
      onClick?: () => void;
      onDelete?: () => void;
      onUpdate?: () => void;
    }) {
      return <div />;
    }

    const result = render(
      <SortProps
        // Wont show up since its a function component
        key="key"
        enabled
        selected={false}
        name="Rut"
        content={<div>Content</div>}
        onUpdate={jest.fn()}
        onClick={jest.fn()}
      />,
    );

    expect(result).toMatchSnapshot();
  });

  it('formats array props', () => {
    function ArrayProp(props: { list: unknown[] }) {
      return <ul />;
    }

    const result = render(<ArrayProp list={['string', 123, true, null, {}, []]} />);

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

  it('formats object props', () => {
    function ObjectProp(props: { data: unknown }) {
      return <div />;
    }

    const result = render(
      <ObjectProp data={{ id: 1, name: 'Bruce Wayne', alias: 'Batman', age: 40 }} />,
    );

    expect(result).toMatchSnapshot();
  });

  it('formats regex props', () => {
    function RegexProp(props: { pattern: RegExp }) {
      return <div />;
    }

    const result = render(<RegexProp pattern={/foo|bar|baz/u} />);

    expect(result).toMatchSnapshot();
  });

  it('formats map props', () => {
    function MapProp(props: { map: Map<string, number> }) {
      return <div />;
    }

    const result = render(<MapProp map={new Map([['foo', 123], ['bar', 456], ['baz', 789]])} />);

    expect(result).toMatchSnapshot();
  });

  it('formats set props', () => {
    function SetProp(props: { set: Set<string> }) {
      return <div />;
    }

    const result = render(<SetProp set={new Set(['foo', 'bar', 'foo', 'baz'])} />);

    expect(result).toMatchSnapshot();
  });
});
