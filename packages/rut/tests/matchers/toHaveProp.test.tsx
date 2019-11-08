import React from 'react';
import toHaveProp from '../../src/matchers/toHaveProp';
import { render, runMatcher } from '../../src/testing/helpers';

describe('toHaveProp()', () => {
  type DivProps = JSX.IntrinsicElements['div'];

  it('errors if a non-Element is passed', () => {
    expect(() => {
      // @ts-ignore
      expect(123).toHaveProp('foo');
    }).toThrow('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when a prop by name exists', () => {
      expect(() => {
        runMatcher(toHaveProp(render<DivProps>(<div id="foo" />).root, 'id'));
      }).not.toThrow();
    });

    it('errors when a prop by name doesnt exist', () => {
      expect(() => {
        runMatcher(toHaveProp(render<DivProps>(<div />).root, 'id'));
      }).toThrow('expected <div /> to have a "id" prop');
    });

    it('passes when a prop by name exists and values match', () => {
      expect(() => {
        runMatcher(toHaveProp(render<DivProps>(<div id="foo" />).root, 'id', 'foo'));
      }).not.toThrow();
    });

    it('errors when a prop by name exists and values dont match', () => {
      expect(() => {
        runMatcher(toHaveProp(render<DivProps>(<div id="foo" />).root, 'id', 'bar'));
      }).toThrow('expected <div /> to have a "id" prop with a value');
    });
  });

  describe('negated', () => {
    it('passes when a prop by name doesnt exist', () => {
      expect(() => {
        runMatcher(toHaveProp(render<DivProps>(<div />).root, 'id'), true);
      }).not.toThrow();
    });

    it('errors when a prop by name exists', () => {
      expect(() => {
        runMatcher(toHaveProp(render<DivProps>(<div id="foo" />).root, 'id'), true);
      }).toThrow('expected <div /> not to have a "id" prop');
    });

    it('passes when a prop by name exists and values dont match', () => {
      expect(() => {
        runMatcher(toHaveProp(render<DivProps>(<div id="foo" />).root, 'id', 'bar'), true);
      }).not.toThrow();
    });

    it('errors when a prop by name exists and values match', () => {
      expect(() => {
        runMatcher(toHaveProp(render<DivProps>(<div id="foo" />).root, 'id', 'foo'), true);
      }).toThrow('expected <div /> not to have a "id" prop with a value');
    });
  });
});
