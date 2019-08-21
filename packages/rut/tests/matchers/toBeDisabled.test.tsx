import React from 'react';
import render from '../../src/render';
import toBeDisabled from '../../src/matchers/toBeDisabled';
import { runMatcher } from '../helpers';

describe('toBeDisabled()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toBeDisabled();
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when disabled', () => {
      expect(() => {
        runMatcher(toBeDisabled(render(<input disabled />).root));
      }).not.toThrowError();
    });

    it('errors when not disabled', () => {
      expect(() => {
        runMatcher(toBeDisabled(render(<input />).root));
      }).toThrowError('expected `input` to have a "disabled" prop with a value of true');
    });
  });

  describe('negated', () => {
    it('passes when not disabled', () => {
      expect(() => {
        runMatcher(toBeDisabled(render(<input />).root), true);
      }).not.toThrowError();
    });

    it('errors when disabled', () => {
      expect(() => {
        runMatcher(toBeDisabled(render(<input disabled />).root), true);
      }).toThrowError('expected `input` not to have a "disabled" prop with a value of true');
    });
  });
});
