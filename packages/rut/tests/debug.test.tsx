import React from 'react';
import render from '../src/render';
import { ClassComp } from './fixtures';

describe('debug()', () => {
  it('adds key and ref props first', () => {
    const ref = React.createRef<ClassComp>();
    const wrapper = render(<ClassComp key={123} ref={ref} name="test" />);

    expect(wrapper).toMatchSnapshot();
  });

  it('formats array props', () => {
    function ArrayProp({ list }: { list: unknown[] }) {
      return <ul />;
    }

    const wrapper = render(<ArrayProp list={['string', 123, true, null, {}, []]} />);

    expect(wrapper).toMatchSnapshot();

    // Test long and complex arrays + objects
    wrapper.update({
      list: [
        { id: 1, name: 'Bruce Wayne' },
        { id: 2, name: 'Clark Kent' },
        { id: 3, name: 'Barry Allen' },
        { id: 4, name: 'Tony Stark' },
        { id: 5, name: 'Steve Rogers' },
        { id: 6, name: 'Bruce Banner' },
      ],
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('formats object props', () => {
    function ObjectProp({ data }: { data: unknown }) {
      return <div />;
    }

    const wrapper = render(
      <ObjectProp data={{ id: 1, name: 'Bruce Wayne', alias: 'Batman', age: 40 }} />,
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('formats regex props', () => {
    function RegexProp({ pattern }: { pattern: RegExp }) {
      return <div />;
    }

    const wrapper = render(<RegexProp pattern={/foo|bar|baz/u} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('formats map props', () => {
    function MapProp({ map }: { map: Map<string, number> }) {
      return <div />;
    }

    const wrapper = render(<MapProp map={new Map([['foo', 123], ['bar', 456], ['baz', 789]])} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('formats set props', () => {
    function SetProp({ set }: { set: Set<string> }) {
      return <div />;
    }

    const wrapper = render(<SetProp set={new Set(['foo', 'bar', 'foo', 'baz'])} />);

    expect(wrapper).toMatchSnapshot();
  });
});
