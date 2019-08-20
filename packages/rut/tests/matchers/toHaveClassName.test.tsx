import React from 'react';
import render from '../../src/render';

describe('toHaveClassName()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveClassName('foo');
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes for exact class name', () => {
      expect(() => {
        expect(render(<div className="foo" />).root).toHaveClassName('foo');
      }).not.toThrowError();
    });

    it('passes when one of the class names exist', () => {
      expect(() => {
        expect(render(<div className="foo bar baz" />).root).toHaveClassName('bar');
      }).not.toThrowError();
    });

    it('errors when the class name does not match', () => {
      expect(() => {
        expect(render(<div className="foo bar" />).root).toHaveClassName('baz');
      }).toThrowError('expected `div` to have a "baz" class name');
    });
  });

  describe('negated', () => {
    it('errors for exact class name', () => {
      expect(() => {
        expect(render(<div className="foo" />).root).not.toHaveClassName('foo');
      }).toThrowError('expected `div` not to have a "foo" class name');
    });

    it('errors when one of the class names exist', () => {
      expect(() => {
        expect(render(<div className="foo bar baz" />).root).not.toHaveClassName('bar');
      }).toThrowError('expected `div` not to have a "bar" class name');
    });

    it('passes when the class name does not match', () => {
      expect(() => {
        expect(render(<div className="foo bar" />).root).not.toHaveClassName('baz');
      }).not.toThrowError();
    });
  });
});
