import React from 'react';
import toHaveKey from '../../src/matchers/toHaveKey';
import { render, runMatcher } from '../../src/testing/helpers';

describe('toHaveKey()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveKey('foo');
    }).toThrow('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when a key matches', () => {
      expect(() => {
        runMatcher(toHaveKey(render(<div key="foo" />).root, 'foo'));
      }).not.toThrow();
    });

    it('errors when a key doesnt exist', () => {
      expect(() => {
        runMatcher(toHaveKey(render(<div />).root, 'id'));
      }).toThrow('expected <div /> to have a "id" key');
    });

    it('errors when a key exists but doesnt match', () => {
      expect(() => {
        runMatcher(toHaveKey(render(<div key="foo" />).root, 'bar'));
      }).toThrow('expected <div /> to have a "bar" key');
    });
  });

  describe('negated', () => {
    it('passes when a key doesnt matches', () => {
      expect(() => {
        runMatcher(toHaveKey(render(<div key="foo" />).root, 'bar'), true);
      }).not.toThrow();
    });

    it('errors when a key exists and matches', () => {
      expect(() => {
        runMatcher(toHaveKey(render(<div key="foo" />).root, 'foo'), true);
      }).toThrow('expected <div /> not to have a "foo" key');
    });
  });
});
