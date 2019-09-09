import React from 'react';
import { render } from '../../src/render';
import toBeElementType from '../../src/matchers/toBeElementType';
import { runMatcher } from '../helpers';
import {
  FuncComp,
  FuncCompWithDisplayName,
  ClassComp,
  ClassCompWithDisplayName,
  TestProps,
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
        runMatcher(toBeElementType(render(<div />).root, 'div'));
      }).not.toThrowError();
    });

    it('errors when types dont match', () => {
      expect(() => {
        runMatcher(toBeElementType(render(<div />).root, 'span'));
      }).toThrowError('expected `div` to be a `span`');
    });

    it('passes when types match (not negation)', () => {
      expect(() => {
        runMatcher(toBeElementType(render(<div />).root, 'span'), true);
      }).not.toThrowError();
    });

    it('errors when types dont match (not negation)', () => {
      expect(() => {
        runMatcher(toBeElementType(render(<div />).root, 'div'), true);
      }).toThrowError('expected `div` not to be a `div`');
    });
  });

  describe('function components', () => {
    it('passes when types match', () => {
      expect(() => {
        runMatcher(toBeElementType(render<TestProps>(<FuncComp />).root, FuncComp));
      }).not.toThrowError();
    });

    it('errors when types dont match', () => {
      expect(() => {
        runMatcher(toBeElementType(render<TestProps>(<FuncComp />).root, FuncCompWithDisplayName));
      }).toThrowError('expected `FuncComp` to be a `CustomFuncName`');
    });

    it('passes when types match (not negation)', () => {
      expect(() => {
        runMatcher(
          toBeElementType(render<TestProps>(<FuncComp />).root, FuncCompWithDisplayName),
          true,
        );
      }).not.toThrowError();
    });

    it('errors when types dont match (not negation)', () => {
      expect(() => {
        runMatcher(toBeElementType(render<TestProps>(<FuncComp />).root, FuncComp), true);
      }).toThrowError('expected `FuncComp` not to be a `FuncComp`');
    });
  });

  describe('class components', () => {
    it('passes when types match', () => {
      expect(() => {
        runMatcher(toBeElementType(render<TestProps>(<ClassComp />).root, ClassComp));
      }).not.toThrowError();
    });

    it('errors when types dont match', () => {
      expect(() => {
        runMatcher(
          toBeElementType(render<TestProps>(<ClassComp />).root, ClassCompWithDisplayName),
        );
      }).toThrowError('expected `ClassComp` to be a `CustomCompName`');
    });

    it('passes when types match (not negation)', () => {
      expect(() => {
        runMatcher(
          toBeElementType(render<TestProps>(<ClassComp />).root, ClassCompWithDisplayName),
          true,
        );
      }).not.toThrowError();
    });

    it('errors when types dont match (not negation)', () => {
      expect(() => {
        runMatcher(toBeElementType(render<TestProps>(<ClassComp />).root, ClassComp), true);
      }).toThrowError('expected `ClassComp` not to be a `ClassComp`');
    });
  });
});
