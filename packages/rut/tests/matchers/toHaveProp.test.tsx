import React from 'react';
import render from '../../src/render';
import toHaveProp from '../../src/matchers/toHaveProp';
import { runMatcher } from '../helpers';

describe('toHaveProp()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveProp('foo');
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when a prop by name exists', () => {
      expect(() => {
        runMatcher(toHaveProp(render(<div id="foo" />).root, 'id'));
      }).not.toThrowError();
    });

    it('errors when a prop by name doesnt exist', () => {
      expect(() => {
        runMatcher(toHaveProp(render(<div />).root, 'id'));
      }).toThrowError('expected `div` to have a "id" prop');
    });

    it('passes when a prop by name exists and values match', () => {
      expect(() => {
        runMatcher(toHaveProp(render(<div id="foo" />).root, 'id', 'foo'));
      }).not.toThrowError();
    });

    it('errors when a prop by name exists and values dont match', () => {
      expect(() => {
        runMatcher(toHaveProp(render(<div id="foo" />).root, 'id', 'bar'));
      }).toThrowError('expected `div` to have a "id" prop with a value of "bar"');
    });
  });

  describe('negated', () => {
    it('passes when a prop by name doesnt exist', () => {
      expect(() => {
        runMatcher(toHaveProp(render(<div />).root, 'id'), true);
      }).not.toThrowError();
    });

    it('errors when a prop by name exists', () => {
      expect(() => {
        runMatcher(toHaveProp(render(<div id="foo" />).root, 'id'), true);
      }).toThrowError('expected `div` not to have a "id" prop');
    });

    it('passes when a prop by name exists and values dont match', () => {
      expect(() => {
        runMatcher(toHaveProp(render(<div id="foo" />).root, 'id', 'bar'), true);
      }).not.toThrowError();
    });

    it('errors when a prop by name exists and values match', () => {
      expect(() => {
        runMatcher(toHaveProp(render(<div id="foo" />).root, 'id', 'foo'), true);
      }).toThrowError('expected `div` not to have a "id" prop with a value of "foo"');
    });
  });
});
