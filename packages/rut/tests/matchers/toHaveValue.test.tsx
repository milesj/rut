import React from 'react';
import toHaveValue from '../../src/matchers/toHaveValue';
import { render, runMatcher } from '../../src/testing/helpers';

describe('toHaveValue()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toHaveValue('');
    }).toThrow('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when value matches', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input value="foo" />).root, 'foo'));
      }).not.toThrow();
    });

    it('passes when default value matches', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input defaultValue="foo" />).root, 'foo'));
      }).not.toThrow();
    });

    it('errors when value doesnt match', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input value="foo" />).root, 'bar'));
      }).toThrow('expected <input /> to have a "value" prop with a value');
    });
  });

  describe('negated', () => {
    it('passes when value doesnt match', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input value="foo" />).root, 'bar'), true);
      }).not.toThrow();
    });

    it('errors when value matches', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input value="foo" />).root, 'foo'), true);
      }).toThrow('expected <input /> not to have a "value" prop with a value');
    });

    it('errors when default value matches', () => {
      expect(() => {
        runMatcher(toHaveValue(render(<input defaultValue="foo" />).root, 'foo'), true);
      }).toThrow('expected <input /> not to have a "defaultValue" prop with a value');
    });
  });
});
