/* eslint-disable jest/expect-expect, rut/require-render-generics */

import React from 'react';
import { render } from '../../src/render';
import toHaveRendered from '../../src/matchers/toHaveRendered';
import { runMatcher } from '../helpers';
import { FuncComp, ClassComp } from '../fixtures';

describe.skip('toHaveRendered()', () => {
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

  it('returns false if null was returned', async () => {
    runMatcher(toHaveRendered((await render(<NullRender />)).root), true);
  });

  it('returns false if false was returned', async () => {
    // @ts-ignore
    runMatcher(toHaveRendered((await render(<FalseRender />)).root), true);
  });

  it('returns true if a host component was rendered', async () => {
    runMatcher(toHaveRendered((await render(<HostCompRender />)).root));
  });

  it('returns true if a function component was rendered', async () => {
    runMatcher(toHaveRendered((await render(<FuncCompRender />)).root));
  });

  it('returns true if a class component was rendered', async () => {
    runMatcher(toHaveRendered((await render(<ClassCompRender />)).root));
  });

  it('returns true if a fragment was rendered', async () => {
    runMatcher(toHaveRendered((await render(<FragmentRender />)).root));
  });

  it('returns true if a string was rendered', async () => {
    // @ts-ignore
    runMatcher(toHaveRendered((await render(<StringRender />)).root));
  });

  it('returns true if an array of nodes was rendered', async () => {
    // @ts-ignore
    runMatcher(toHaveRendered((await render(<ArrayRender />)).root));
  });

  it('returns true if a child component that rendered null was rendered', async () => {
    runMatcher(toHaveRendered((await render(<NestedNullRender />)).root));
  });
});
