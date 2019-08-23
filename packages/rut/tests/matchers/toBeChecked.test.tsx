import React from 'react';
import { render } from '../../src/render';
import toBeChecked from '../../src/matchers/toBeChecked';
import { runMatcher } from '../helpers';

describe('toBeChecked()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toBeChecked();
    }).toThrowError('Expected a Rut `Element`.');

    expect(() => {
      // @ts-ignore Allow invalid
      runMatcher(toBeChecked(123));
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input checked />).root));
      }).not.toThrowError();
    });

    it('passes when default checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input defaultChecked />).root));
      }).not.toThrowError();
    });

    it('errors when not checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input />).root));
      }).toThrowError('expected `input` to have a "checked" prop with a value of true');
    });
  });

  describe('negated', () => {
    it('passes when not checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input />).root), true);
      }).not.toThrowError();
    });

    it('errors when checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input checked />).root), true);
      }).toThrowError('expected `input` not to have a "checked" prop with a value of true');
    });

    it('errors when default checked', () => {
      expect(() => {
        runMatcher(toBeChecked(render(<input defaultChecked />).root), true);
      }).toThrowError('expected `input` not to have a "defaultChecked" prop with a value of true');
    });
  });
});
