import React from 'react';
import { render } from '../../src/render';
import toHaveProps from '../../src/matchers/toHaveProps';
import { InferComponentProps } from '../../src/types';
import { runMatcher } from '../helpers';

describe('toHaveProps()', () => {
  type DivProps = InferComponentProps<'div'>;

  it('errors if a non-Element is passed', () => {
    expect(() => {
      // @ts-ignore
      expect(123).toHaveProps('foo');
    }).toThrowError('Expected a Rut `Element`.');
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
      }).not.toThrowError();
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
      }).toThrowError('expected `div` to have matching props for "id"');
    });

    it('errors when a prop by name exists and values dont match', () => {
      expect(() => {
        runMatcher(
          toHaveProps(render<DivProps>(<div id="foo" className="foo" />).root, {
            id: 'foo',
            className: 'bar',
          }),
        );
      }).toThrowError('expected `div` to have matching props for "id", "className"');
    });
  });

  describe('negated', () => {
    it('passes when a prop by name doesnt exist', () => {
      expect(() => {
        runMatcher(toHaveProps(render<DivProps>(<div />).root, { id: 'foo' }), true);
      }).not.toThrowError();
    });

    it('errors when a prop by name exists and values match', () => {
      expect(() => {
        runMatcher(toHaveProps(render<DivProps>(<div id="foo" />).root, { id: 'foo' }), true);
      }).toThrowError('expected `div` not to have matching props for "id"');
    });

    it('passes when a prop by name exists and values dont match', () => {
      expect(() => {
        runMatcher(toHaveProps(render<DivProps>(<div id="foo" />).root, { id: 'bar' }), true);
      }).not.toThrowError();
    });
  });
});
