import React from 'react';
import { render } from '../../src/render';
import toHaveValue from '../../src/matchers/toHaveValue';
import { runMatcher } from '../helpers';

describe('toHaveValue()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveValue('');
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when value matches', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input value="foo" />).root, 'foo'));
      }).not.toThrowError();
    });

    it('passes when default value matches', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input defaultValue="foo" />).root, 'foo'));
      }).not.toThrowError();
    });

    it('errors when value doesnt match', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input value="foo" />).root, 'bar'));
      }).toThrowError('expected `input` to have a "value" prop with a value of "bar"');
    });
  });

  describe('negated', () => {
    it('passes when value doesnt match', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input value="foo" />).root, 'bar'), true);
      }).not.toThrowError();
    });

    it('errors when value matches', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input value="foo" />).root, 'foo'), true);
      }).toThrowError('expected `input` not to have a "value" prop with a value of "foo"');
    });

    it('errors when default value matches', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input defaultValue="foo" />).root, 'foo'), true);
      }).toThrowError('expected `input` not to have a "defaultValue" prop with a value of "foo"');
    });
  });
});
