import React from 'react';
import { render } from '../../src/render';
import toHaveKey from '../../src/matchers/toHaveKey';
import { runMatcher } from '../helpers';

describe.skip('toHaveKey()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveKey('foo');
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when a key matches', () => {
      expect(async () => {
        runMatcher(toHaveKey((await render(<div key="foo" />)).root, 'foo'));
      }).not.toThrowError();
    });

    it('errors when a key doesnt exist', () => {
      expect(async () => {
        runMatcher(toHaveKey((await render(<div />)).root, 'id'));
      }).toThrowError('expected <div /> to have a "id" key');
    });

    it('errors when a key exists but doesnt match', () => {
      expect(async () => {
        runMatcher(toHaveKey((await render(<div key="foo" />)).root, 'bar'));
      }).toThrowError('expected <div /> to have a "bar" key');
    });
  });

  describe('negated', () => {
    it('passes when a key doesnt matches', () => {
      expect(async () => {
        runMatcher(toHaveKey((await render(<div key="foo" />)).root, 'bar'), true);
      }).not.toThrowError();
    });

    it('errors when a key exists and matches', () => {
      expect(async () => {
        runMatcher(toHaveKey((await render(<div key="foo" />)).root, 'foo'), true);
      }).toThrowError('expected <div /> not to have a "foo" key');
    });
  });
});
