import React from 'react';
import render from '../../src/render';

describe('toBeDisabled()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toBeDisabled();
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when disabled', () => {
      expect(() => {
        expect(render(<input disabled />).root()).toBeDisabled();
      }).not.toThrowError();
    });

    it('errors when not disabled', () => {
      expect(() => {
        expect(render(<input />).root()).toBeDisabled();
      }).toThrowError('expected `input` to have a "disabled" prop with a value of true');
    });
  });

  describe('negated', () => {
    it('passes when not disabled', () => {
      expect(() => {
        expect(render(<input />).root()).not.toBeDisabled();
      }).not.toThrowError();
    });

    it('errors when disabled', () => {
      expect(() => {
        expect(render(<input disabled />).root()).not.toBeDisabled();
      }).toThrowError('expected `input` not to have a "disabled" prop with a value of true');
    });
  });
});
