import React from 'react';
import Element from '../Element';
import { formatValue } from '../helpers';
import { MatchResult } from '../types';
import { isRutElement } from '../internals/utils';

/**
 * Check that an element has a React `key` that matches the provided value.
 */
export default function toHaveKey(element: Element, value: React.Key): MatchResult {
  isRutElement(element);

  // @ts-ignore Allow access for matcher
  const { key } = element.element._fiber;
  const actualValue = formatValue(key);
  const expectedValue = formatValue(value);

  return {
    message: `expected \`${element}\` to have a ${expectedValue} key, has ${actualValue}`,
    notMessage: `expected \`${element}\` not to have a ${expectedValue} key, has ${actualValue}`,
    passed: key !== null && key === value,
  };
}
