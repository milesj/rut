import React from 'react';
import toBeDisabled from '../../src/matchers/toBeDisabled';
import { render, runMatcher } from '../../src/testing/helpers';

describe('toBeDisabled()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toBeDisabled();
    }).toThrow('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when disabled', () => {
      expect(() => {
        runMatcher(toBeDisabled(render(<input disabled />).root));
      }).not.toThrow();
    });

    it('errors when not disabled', () => {
      expect(() => {
        runMatcher(toBeDisabled(render(<input />).root));
      }).toThrow(
        'expected <input /> to have a "disabled" prop with a value of `true`, instead has a value of `undefined`',
      );
    });
  });

  describe('negated', () => {
    it('passes when not disabled', () => {
      expect(() => {
        runMatcher(toBeDisabled(render(<input />).root), true);
      }).not.toThrow();
    });

    it('errors when disabled', () => {
      expect(() => {
        runMatcher(toBeDisabled(render(<input disabled />).root), true);
      }).toThrow(
        'expected <input /> not to have a "disabled" prop with a value of `true`, instead has a value of `true`',
      );
    });
  });
});
