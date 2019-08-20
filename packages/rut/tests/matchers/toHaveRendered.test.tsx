import React from 'react';
import render from '../../src/render';
import { FuncComp, ClassComp } from '../fixtures';

describe('toHaveRendered()', () => {
  function NullRender() {
    return null;
  }

  function FalseRender() {
    return false;
  }

  function HostCompRender() {
    return <div />;
  }

  function FuncCompRender() {
    return <FuncComp />;
  }

  function ClassCompRender() {
    return <ClassComp />;
  }

  function FragmentRender() {
    return <>Content</>;
  }

  function StringRender() {
    return 'Content';
  }

  function ArrayRender() {
    return ['Content', <span key="span" />];
  }

  function NestedNullRender() {
    return <NullRender />;
  }

  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveRendered();
    }).toThrowError('Expected a Rut `Element`.');
  });

  it('returns false if null was returned', () => {
    expect(render(<NullRender />).root).not.toHaveRendered();
  });

  it('returns false if false was returned', () => {
    // @ts-ignore
    expect(render(<FalseRender />).root).not.toHaveRendered();
  });

  it('returns true if a host component was rendered', () => {
    expect(render(<HostCompRender />).root).toHaveRendered();
  });

  it('returns true if a function component was rendered', () => {
    expect(render(<FuncCompRender />).root).toHaveRendered();
  });

  it('returns true if a class component was rendered', () => {
    expect(render(<ClassCompRender />).root).toHaveRendered();
  });

  it('returns true if a fragment was rendered', () => {
    expect(render(<FragmentRender />).root).toHaveRendered();
  });

  it('returns true if a string was rendered', () => {
    // @ts-ignore
    expect(render(<StringRender />).root).toHaveRendered();
  });

  it('returns true if an array of nodes was rendered', () => {
    // @ts-ignore
    expect(render(<ArrayRender />).root).toHaveRendered();
  });

  it('returns true if a child component that rendered null was rendered', () => {
    expect(render(<NestedNullRender />).root).toHaveRendered();
  });
});
