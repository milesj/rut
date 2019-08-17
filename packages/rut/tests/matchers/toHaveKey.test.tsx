import React from 'react';
import render from '../../src/render';

describe('toHaveKey()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveKey('foo');
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when a key matches', () => {
      expect(() => {
        expect(render(<div key="foo" />).root()).toHaveKey('foo');
      }).not.toThrowError();
    });

    it('errors when a key doesnt exist', () => {
      expect(() => {
        expect(render(<div />).root()).toHaveKey('id');
      }).toThrowError('expected `div` to have a "id" key');
    });

    it('errors when a key exists but doesnt match', () => {
      expect(() => {
        expect(render(<div key="foo" />).root()).toHaveKey('bar');
      }).toThrowError('expected `div` to have a "bar" key');
    });
  });

  describe('negated', () => {
    it('passes when a key doesnt matches', () => {
      expect(() => {
        expect(render(<div key="foo" />).root()).not.toHaveKey('bar');
      }).not.toThrowError();
    });

    it('errors when a key exists and matches', () => {
      expect(() => {
        expect(render(<div key="foo" />).root()).not.toHaveKey('foo');
      }).toThrowError('expected `div` not to have a "foo" key');
    });
  });
});
