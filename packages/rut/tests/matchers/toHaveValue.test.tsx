import React from 'react';
import render from '../../src/render';

describe('toHaveValue()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveValue('');
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when value matches', () => {
      expect(() => {
        expect(render(<input value="foo" />).root).toHaveValue('foo');
      }).not.toThrowError();
    });

    it('passes when default value matches', () => {
      expect(() => {
        expect(render(<input defaultValue="foo" />).root).toHaveValue('foo');
      }).not.toThrowError();
    });

    it('errors when value doesnt match', () => {
      expect(() => {
        expect(render(<input value="foo" />).root).toHaveValue('bar');
      }).toThrowError('expected `input` to have a "value" prop with a value of "bar"');
    });
  });

  describe('negated', () => {
    it('passes when value doesnt match', () => {
      expect(() => {
        expect(render(<input value="foo" />).root).not.toHaveValue('bar');
      }).not.toThrowError();
    });

    it('errors when value matches', () => {
      expect(() => {
        expect(render(<input value="foo" />).root).not.toHaveValue('foo');
      }).toThrowError('expected `input` not to have a "value" prop with a value of "foo"');
    });

    it('errors when default value matches', () => {
      expect(() => {
        expect(render(<input defaultValue="foo" />).root).not.toHaveValue('foo');
      }).toThrowError('expected `input` not to have a "defaultValue" prop with a value of "foo"');
    });
  });
});
