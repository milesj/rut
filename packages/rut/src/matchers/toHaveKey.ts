import React from 'react';
import Element from '../Element';
import { formatValue } from '../internals/react';
import { isRutElement } from '../internals/utils';
import { MatchResult } from '../types';

/**
 * Check that an element has a React `key` that matches the provided value.
 */
export default function toHaveKey(element: Element, value: React.Key): MatchResult {
  isRutElement(element);

  // @ts-expect-error Allow internal access
  const { key } = element.element._fiber;
  const actualValue = formatValue(key);
  const expectedValue = formatValue(value);

  return {
    actual: actualValue,
    expected: expectedValue,
    message: `expected {{received}} to have a {{expected}} key, has {{actual}}`,
    name: 'toHaveKey',
    notMessage: `expected {{received}} not to have a {{expected}} key, has {{actual}}`,
    passed: key !== null && key === value,
    received: element.toString(),
  };
}
