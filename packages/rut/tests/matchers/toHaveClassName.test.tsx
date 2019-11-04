import React from 'react';
import toHaveClassName from '../../src/matchers/toHaveClassName';
import { render, runMatcher } from '../../src/testing/helpers';

describe('toHaveClassName()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveClassName('foo');
    }).toThrow('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes for exact class name', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo" />).root, 'foo'));
      }).not.toThrow();
    });

    it('passes when one of the class names exist', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo bar baz" />).root, 'bar'));
      }).not.toThrow();
    });

    it('errors when the class name does not match', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo bar" />).root, 'baz'));
      }).toThrow('expected <div /> to have a "baz" class name');
    });
  });

  describe('negated', () => {
    it('errors for exact class name', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo" />).root, 'foo'), true);
      }).toThrow('expected <div /> not to have a "foo" class name');
    });

    it('errors when one of the class names exist', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo bar baz" />).root, 'bar'), true);
      }).toThrow('expected <div /> not to have a "bar" class name');
    });

    it('passes when the class name does not match', () => {
      expect(() => {
        runMatcher(toHaveClassName(render(<div className="foo bar" />).root, 'baz'), true);
      }).not.toThrow();
    });
  });
});
