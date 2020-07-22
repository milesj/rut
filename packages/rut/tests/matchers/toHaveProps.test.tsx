import React from 'react';
import toHaveProps from '../../src/matchers/toHaveProps';
import { render, runMatcher } from '../../src/testing/helpers';

describe('toHaveProps()', () => {
  type DivProps = JSX.IntrinsicElements['div'];

  it('errors if a non-Element is passed', () => {
    expect(() => {
      // @ts-expect-error
      expect(123).toHaveProps('foo');
    }).toThrow('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when a prop by name exists and values match', () => {
      expect(() => {
        runMatcher(
          toHaveProps(render<DivProps>(<div id="foo" className="foo" />).root, {
            id: 'foo',
            className: 'foo',
          }),
        );
      }).not.toThrow();
    });

    it('passes when using `expect` utils', () => {
      expect(render<DivProps>(<div id="foo" className="foo" />).root).toHaveProps(
        expect.objectContaining({
          className: 'foo',
        }),
      );
    });

    it('errors when a prop by name doesnt exist', () => {
      expect(() => {
        runMatcher(
          toHaveProps(render<DivProps>(<div />).root, {
            id: 'foo',
          }),
        );
      }).toThrow('expected <div /> to have matching props for "id"');
    });

    it('errors when a prop by name exists and values dont match', () => {
      expect(() => {
        runMatcher(
          toHaveProps(render<DivProps>(<div id="foo" className="foo" />).root, {
            id: 'foo',
            className: 'bar',
          }),
        );
      }).toThrow('expected <div /> to have matching props for "id", "className"');
    });
  });

  describe('negated', () => {
    it('passes when a prop by name doesnt exist', () => {
      expect(() => {
        runMatcher(toHaveProps(render<DivProps>(<div />).root, { id: 'foo' }), true);
      }).not.toThrow();
    });

    it('errors when a prop by name exists and values match', () => {
      expect(() => {
        runMatcher(toHaveProps(render<DivProps>(<div id="foo" />).root, { id: 'foo' }), true);
      }).toThrow('expected <div /> not to have matching props for "id"');
    });

    it('passes when a prop by name exists and values dont match', () => {
      expect(() => {
        runMatcher(toHaveProps(render<DivProps>(<div id="foo" />).root, { id: 'bar' }), true);
      }).not.toThrow();
    });
  });
});
