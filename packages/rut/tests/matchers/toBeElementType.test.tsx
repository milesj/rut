import React from 'react';
import render from '../../src/render';
import {
  FuncComp,
  FuncCompWithDisplayName,
  ClassComp,
  ClassCompWithDisplayName,
} from '../fixtures';

describe('toBeElementType()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toBeElementType('div');
    }).toThrowError('Expected a Rut `Element`.');
  });

  describe('host components', () => {
    it('passes when types match', () => {
      expect(() => {
        expect(render(<div />).root).toBeElementType('div');
      }).not.toThrowError();
    });

    it('errors when types dont match', () => {
      expect(() => {
        expect(render(<div />).root).toBeElementType('span');
      }).toThrowError('expected `div` to be a `span`');
    });

    it('passes when types match (not negation)', () => {
      expect(() => {
        expect(render(<div />).root).not.toBeElementType('span');
      }).not.toThrowError();
    });

    it('errors when types dont match (not negation)', () => {
      expect(() => {
        expect(render(<div />).root).not.toBeElementType('div');
      }).toThrowError('expected `div` not to be a `div`');
    });
  });

  describe('function components', () => {
    it('passes when types match', () => {
      expect(() => {
        expect(render(<FuncComp />).root).toBeElementType(FuncComp);
      }).not.toThrowError();
    });

    it('errors when types dont match', () => {
      expect(() => {
        expect(render(<FuncComp />).root).toBeElementType(FuncCompWithDisplayName);
      }).toThrowError('expected `FuncComp` to be a `CustomFuncName`');
    });

    it('passes when types match (not negation)', () => {
      expect(() => {
        expect(render(<FuncComp />).root).not.toBeElementType(FuncCompWithDisplayName);
      }).not.toThrowError();
    });

    it('errors when types dont match (not negation)', () => {
      expect(() => {
        expect(render(<FuncComp />).root).not.toBeElementType(FuncComp);
      }).toThrowError('expected `FuncComp` not to be a `FuncComp`');
    });
  });

  describe('class components', () => {
    it('passes when types match', () => {
      expect(() => {
        expect(render(<ClassComp />).root).toBeElementType(ClassComp);
      }).not.toThrowError();
    });

    it('errors when types dont match', () => {
      expect(() => {
        expect(render(<ClassComp />).root).toBeElementType(ClassCompWithDisplayName);
      }).toThrowError('expected `ClassComp` to be a `CustomCompName`');
    });

    it('passes when types match (not negation)', () => {
      expect(() => {
        expect(render(<ClassComp />).root).not.toBeElementType(ClassCompWithDisplayName);
      }).not.toThrowError();
    });

    it('errors when types dont match (not negation)', () => {
      expect(() => {
        expect(render(<ClassComp />).root).not.toBeElementType(ClassComp);
      }).toThrowError('expected `ClassComp` not to be a `ClassComp`');
    });
  });
});
