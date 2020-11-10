import Element from '../Element';
import { getProp } from '../internals/element';
import { formatValue } from '../internals/react';
import { deepEqual, isRutElement } from '../internals/utils';
import { MatchResult } from '../types';

/**
 * Check that an element has a prop that matches the provided name, with optional matching value.
 * Arrays and objects will be matched using deep equality.
 */
export default function toHaveProp(element: Element, name: string, value?: unknown): MatchResult {
  isRutElement(element);

  const actualValue = getProp(element, name);
  const formattedName = formatValue(name);

  if (value !== undefined) {
    return {
      actual: actualValue,
      diff: true,
      expected: value,
      message: `expected {{received}} to have a ${formattedName} prop with a value`,
      name: 'toHaveProp',
      notMessage: `expected {{received}} not to have a ${formattedName} prop with a value`,
      passed: (equals) => (equals ? equals(actualValue, value) : deepEqual(actualValue, value)),
      received: element.toString(),
    };
  }

  return {
    message: `expected {{received}} to have a ${formattedName} prop`,
    name: 'toHaveProp',
    notMessage: `expected {{received}} not to have a ${formattedName} prop`,
    passed: actualValue !== undefined,
    received: element.toString(),
  };
}
