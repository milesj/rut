import Element from '../Element';
import { getProp } from '../internals/element';
import { formatValue } from '../internals/react';
import { isRutElement, deepEqual } from '../internals/utils';
import { MatchResult } from '../types';

/**
 * Check that an element has a prop that matches the provided name, with optional matching value.
 * Arrays and objects will be matched using deep equality.
 */
export default function toHaveProp(element: Element, name: string, value?: unknown): MatchResult {
  isRutElement(element);

  const prop = getProp(element, name);
  const formattedName = formatValue(name);
  const formattedValue = formatValue(value);
  const actualValue = formatValue(prop);

  if (value !== undefined) {
    return {
      actual: actualValue,
      expected: formattedValue,
      message: `expected {{received}} to have a ${formattedName} prop with a value of {{expected}}, instead has a value of {{actual}}`,
      name: 'toHaveProp',
      notMessage: `expected {{received}} not to have a ${formattedName} prop with a value of {{expected}}, instead has a value of {{actual}}`,
      passed: equals => (equals ? equals(prop, value) : deepEqual(prop, value)),
      received: element.toString(),
    };
  }

  return {
    message: `expected {{received}} to have a ${formattedName} prop`,
    name: 'toHaveProp',
    notMessage: `expected {{received}} not to have a ${formattedName} prop`,
    passed: prop !== undefined,
    received: element.toString(),
  };
}
