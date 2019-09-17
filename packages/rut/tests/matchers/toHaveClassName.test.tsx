import React from 'react';
import { render } from '../../src/render';
import toHaveClassName from '../../src/matchers/toHaveClassName';
import { runMatcher } from '../helpers';

describe('toHaveClassName()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveClassName('foo');
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes for exact class name', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo" />).root, 'foo'));
      }).not.toThrowError();
    });

    it('passes when one of the class names exist', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo bar baz" />).root, 'bar'));
      }).not.toThrowError();
    });

    it('errors when the class name does not match', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo bar" />).root, 'baz'));
      }).toThrowError('expected <div /> to have a "baz" class name');
    });
  });

  describe('negated', () => {
    it('errors for exact class name', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo" />).root, 'foo'), true);
      }).toThrowError('expected <div /> not to have a "foo" class name');
    });

    it('errors when one of the class names exist', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo bar baz" />).root, 'bar'), true);
      }).toThrowError('expected <div /> not to have a "bar" class name');
    });

    it('passes when the class name does not match', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo bar" />).root, 'baz'), true);
      }).not.toThrowError();
    });
  });
});
