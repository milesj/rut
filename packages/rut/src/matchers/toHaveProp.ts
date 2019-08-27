import Element from '../Element';
import { checkIsRutElement } from '../internals/helpers';
import { formatValue } from '../helpers';
import { MatchResult } from '../types';

/**
 * Check that an element has a prop by name defined, with optional value matching support.
 */
export default function toHaveProp<P>(
  element: Element<P>,
  name: keyof P,
  value?: unknown,
): MatchResult {
  checkIsRutElement(element);

  const prop = element.prop(name);
  const formattedName = formatValue(name);
  const formattedValue = formatValue(value);

  if (value !== undefined) {
    return {
      message: `expected \`${element}\` to have a ${formattedName} prop with a value of ${formattedValue}`,
      notMessage: `expected \`${element}\` not to have a ${formattedName} prop with a value of ${formattedValue}`,
      passed: prop === value,
    };
  }

  return {
    message: `expected \`${element}\` to have a ${formattedName} prop`,
    notMessage: `expected \`${element}\` not to have a ${formattedName} prop`,
    passed: prop !== undefined,
  };
}
