import React from 'react';
import toBeElementType from '../../src/matchers/toBeElementType';
import {
  ClassComp,
  ClassCompWithDisplayName,
  FuncComp,
  FuncCompWithDisplayName,
  TestProps,
} from '../../src/testing/fixtures';
import { render, runMatcher } from '../../src/testing/helpers';

describe('toBeElementType()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toBeElementType('div');
    }).toThrow('Expected a Rut `Element`.');
  });

  describe('host components', () => {
    it('passes when types match', () => {
      expect(() => {
        runMatcher(toBeElementType(render(<div />).root, 'div'));
      }).not.toThrow();
    });

    it('errors when types dont match', () => {
      expect(() => {
        runMatcher(toBeElementType(render(<div />).root, 'span'));
      }).toThrow('expected <div /> to be a "span"');
    });

    it('passes when types match (not negation)', () => {
      expect(() => {
        runMatcher(toBeElementType(render(<div />).root, 'span'), true);
      }).not.toThrow();
    });

    it('errors when types dont match (not negation)', () => {
      expect(() => {
        runMatcher(toBeElementType(render(<div />).root, 'div'), true);
      }).toThrow('expected <div /> not to be a "div"');
    });
  });

  describe('function components', () => {
    it('passes when types match', () => {
      expect(() => {
        runMatcher(toBeElementType(render<TestProps>(<FuncComp />).root, FuncComp));
      }).not.toThrow();
    });

    it('errors when types dont match', () => {
      expect(() => {
        runMatcher(toBeElementType(render<TestProps>(<FuncComp />).root, FuncCompWithDisplayName));
      }).toThrow('expected <FuncComp /> to be a `CustomFuncName`');
    });

    it('passes when types match (not negation)', () => {
      expect(() => {
        runMatcher(
          toBeElementType(render<TestProps>(<FuncComp />).root, FuncCompWithDisplayName),
          true,
        );
      }).not.toThrow();
    });

    it('errors when types dont match (not negation)', () => {
      expect(() => {
        runMatcher(toBeElementType(render<TestProps>(<FuncComp />).root, FuncComp), true);
      }).toThrow('expected <FuncComp /> not to be a `FuncComp`');
    });
  });

  describe('class components', () => {
    it('passes when types match', () => {
      expect(() => {
        runMatcher(toBeElementType(render<TestProps>(<ClassComp />).root, ClassComp));
      }).not.toThrow();
    });

    it('errors when types dont match', () => {
      expect(() => {
        runMatcher(
          toBeElementType(render<TestProps>(<ClassComp />).root, ClassCompWithDisplayName),
        );
      }).toThrow('expected <ClassComp /> to be a `CustomCompName`');
    });

    it('passes when types match (not negation)', () => {
      expect(() => {
        runMatcher(
          toBeElementType(render<TestProps>(<ClassComp />).root, ClassCompWithDisplayName),
          true,
        );
      }).not.toThrow();
    });

    it('errors when types dont match (not negation)', () => {
      expect(() => {
        runMatcher(toBeElementType(render<TestProps>(<ClassComp />).root, ClassComp), true);
      }).toThrow('expected <ClassComp /> not to be a `ClassComp`');
    });
  });
});
