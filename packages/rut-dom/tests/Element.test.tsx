import React from 'react';
import { runElementTestSuite } from 'rut/lib/testing/suites/element';
import { mockSyntheticEvent, render, renderAndWait } from '../src';

runElementTestSuite('DomElement', {
  mockSyntheticEvent,
  render,
  renderAndWait,
});

describe('DomElement', () => {
  it('executes the function prop with a custom target', () => {
    const spy = jest.fn();
    const target = { tagName: 'BUTTON' };

    function DispatchComp() {
      return (
        <button type="button" onClick={spy}>
          Click
        </button>
      );
    }

    const { root } = render<{}>(<DispatchComp />);

    root.findOne('button').dispatch('onClick', { shiftKey: true, target });

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        shiftKey: true,
        target,
      }),
    );
  });
});
