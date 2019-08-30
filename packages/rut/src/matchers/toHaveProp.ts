import Element from '../Element';
import { checkIsRutElement, getPropFromElement, shallowEqual } from '../internals/helpers';
import { formatValue } from '../helpers';
import { MatchResult } from '../types';

/**
 * Check that an element has a prop that matches the provided name, with optional matching value.
 * * Arrays and objects will be matched using shallow equality.
 */
export default function toHaveProp<P>(
  element: Element<P>,
  name: keyof P,
  value?: unknown,
): MatchResult {
  checkIsRutElement(element);

  const prop = getPropFromElement(element, name);
  const formattedName = formatValue(name);
  const formattedValue = formatValue(value);

  if (value !== undefined) {
    return {
      message: `expected \`${element}\` to have a ${formattedName} prop with a value of ${formattedValue}`,
      notMessage: `expected \`${element}\` not to have a ${formattedName} prop with a value of ${formattedValue}`,
      passed: shallowEqual(prop, value),
    };
  }

  return {
    message: `expected \`${element}\` to have a ${formattedName} prop`,
    notMessage: `expected \`${element}\` not to have a ${formattedName} prop`,
    passed: prop !== undefined,
  };
}
