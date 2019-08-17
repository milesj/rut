import React from 'react';
import render from '../../src/render';

describe('toBeChecked()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toBeChecked();
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('normal', () => {
    it('passes when checked', () => {
      expect(() => {
        expect(render(<input checked />).root()).toBeChecked();
      }).not.toThrowError();
    });

    it('passes when default checked', () => {
      expect(() => {
        expect(render(<input defaultChecked />).root()).toBeChecked();
      }).not.toThrowError();
    });

    it('errors when not checked', () => {
      expect(() => {
        expect(render(<input />).root()).toBeChecked();
      }).toThrowError('expected `input` to have a "checked" prop with a value of true');
    });
  });

  describe('negated', () => {
    it('passes when not checked', () => {
      expect(() => {
        expect(render(<input />).root()).not.toBeChecked();
      }).not.toThrowError();
    });

    it('errors when checked', () => {
      expect(() => {
        expect(render(<input checked />).root()).not.toBeChecked();
      }).toThrowError('expected `input` not to have a "checked" prop with a value of true');
    });

    it('errors when default checked', () => {
      expect(() => {
        expect(render(<input defaultChecked />).root()).not.toBeChecked();
      }).toThrowError('expected `input` not to have a "defaultChecked" prop with a value of true');
    });
  });
});
