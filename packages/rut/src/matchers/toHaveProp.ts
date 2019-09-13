import Element from '../Element';
import { getProp } from '../internals/element';
import { formatValue } from '../helpers';
import { MatchResult } from '../types';
import { isRutElement, deepEqual } from '../internals/utils';

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
      message: `expected \`${element}\` to have a ${formattedName} prop with a value of ${formattedValue}, instead has a value of ${actualValue}`,
      notMessage: `expected \`${element}\` not to have a ${formattedName} prop with a value of ${formattedValue}, instead has a value of ${actualValue}`,
      passed: deepEqual(prop, value),
    };
  }

  return {
    message: `expected \`${element}\` to have a ${formattedName} prop`,
    notMessage: `expected \`${element}\` not to have a ${formattedName} prop`,
    passed: prop !== undefined,
  };
}
