import React from 'react';
import { getTypeName } from '../src/helpers';
import {
  FuncComp,
  FuncCompWithDisplayName,
  ClassComp,
  ClassCompWithDisplayName,
  TestContext,
  ForwardRefComp,
  LazyComp,
  MemoComp,
} from './fixtures';

describe('helpers', () => {
  describe('getTypeName()', () => {
    it('returns unknown for falsy values', () => {
      expect(getTypeName('')).toBe('UNKNOWN');
      expect(getTypeName(false)).toBe('UNKNOWN');
      expect(getTypeName(null)).toBe('UNKNOWN');
    });

    it('returns function component name', () => {
      expect(getTypeName(FuncComp)).toBe('FuncComp');
    });

    it('returns function component display name', () => {
      expect(getTypeName(FuncCompWithDisplayName)).toBe('CustomFuncName');
    });

    it('returns function component name from an element', () => {
      expect(getTypeName(<FuncComp />)).toBe('FuncComp');
    });

    it('returns class component name', () => {
      expect(getTypeName(ClassComp)).toBe('ClassComp');
    });

    it('returns class component display name', () => {
      expect(getTypeName(ClassCompWithDisplayName)).toBe('CustomCompName');
    });

    it('returns class component name from an element', () => {
      expect(getTypeName(<ClassComp />)).toBe('ClassComp');
    });

    it('returns context consumer name', () => {
      expect(getTypeName(<TestContext.Consumer>{() => null}</TestContext.Consumer>)).toBe(
        'TestContext.Consumer',
      );
    });

    it('returns context provider name', () => {
      expect(getTypeName(<TestContext.Provider value="test">{null}</TestContext.Provider>)).toBe(
        'TestContext.Provider',
      );
    });

    it('returns forward ref name', () => {
      expect(getTypeName(<ForwardRefComp />)).toBe('ForwardRef');
    });

    it('returns fragment name', () => {
      expect(getTypeName(<>Test</>)).toBe('Fragment');
    });

    it('returns fragment name for full form', () => {
      // eslint-disable-next-line react/jsx-fragments
      expect(getTypeName(<React.Fragment>Test</React.Fragment>)).toBe('Fragment');
    });

    it('returns lazy name', () => {
      expect(getTypeName(<LazyComp />)).toBe('Lazy');
    });

    it('returns memo + component name', () => {
      expect(getTypeName(<MemoComp />)).toBe('Memo(FuncComp)');
    });

    it('returns profiler + id name', () => {
      expect(getTypeName(<React.Profiler id="test" onRender={jest.fn()} />)).toBe('Profiler(test)');
    });

    it('returns strict mode name', () => {
      expect(getTypeName(<React.StrictMode />)).toBe('StrictMode');
    });

    it('returns suspense name', () => {
      expect(getTypeName(<React.Suspense fallback={<div />} />)).toBe('Suspense');
    });
  });
});
