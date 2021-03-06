import React from 'react';
import toBeChecked from '../../src/matchers/toBeChecked';
import { render, runMatcher } from '../../src/testing/helpers';

describe('toBeChecked()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toBeChecked();
    }).toThrow('Expected a Rut `Element`.');

    expect(() => {
      // @ts-expect-error Allow invalid
      runMatcher(toBeChecked(123));
    }).toThrow('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input checked />).root));
      }).not.toThrow();
    });

    it('passes when default checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input defaultChecked />).root));
      }).not.toThrow();
    });

    it('errors when not checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input />).root));
      }).toThrow('expected <input /> to have a "checked" prop with a value');
    });
  });

  describe('negated', () => {
    it('passes when not checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input />).root), true);
      }).not.toThrow();
    });

    it('errors when checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input checked />).root), true);
      }).toThrow('expected <input /> not to have a "checked" prop with a value');
    });

    it('errors when default checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input defaultChecked />).root), true);
      }).toThrow('expected <input /> not to have a "defaultChecked" prop with a value');
    });
  });
});
