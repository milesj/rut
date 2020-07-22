/* eslint-disable jest/expect-expect, rut/require-render-generics */

import React from 'react';
import toHaveRendered from '../../src/matchers/toHaveRendered';
import { render, runMatcher } from '../../src/testing/helpers';
import { FuncComp, ClassComp } from '../../src/testing/fixtures';

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
    }).toThrow('Expected a Rut `Element`.');
  });

  it('returns false if null was returned', () => {
    runMatcher(toHaveRendered(render(<NullRender />).root), true);
  });

  it('returns false if false was returned', () => {
    // @ts-expect-error
    runMatcher(toHaveRendered(render(<FalseRender />).root), true);
  });

  it('returns true if a host component was rendered', () => {
    runMatcher(toHaveRendered(render(<HostCompRender />).root));
  });

  it('returns true if a function component was rendered', () => {
    runMatcher(toHaveRendered(render(<FuncCompRender />).root));
  });

  it('returns true if a class component was rendered', () => {
    runMatcher(toHaveRendered(render(<ClassCompRender />).root));
  });

  it('returns true if a fragment was rendered', () => {
    runMatcher(toHaveRendered(render(<FragmentRender />).root));
  });

  it('returns true if a string was rendered', () => {
    // @ts-expect-error
    runMatcher(toHaveRendered(render(<StringRender />).root));
  });

  it('returns true if an array of nodes was rendered', () => {
    // @ts-expect-error
    runMatcher(toHaveRendered(render(<ArrayRender />).root));
  });

  it('returns true if a child component that rendered null was rendered', () => {
    runMatcher(toHaveRendered(render(<NestedNullRender />).root));
  });
});
