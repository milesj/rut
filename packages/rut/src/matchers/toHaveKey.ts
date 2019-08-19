import Element from '../Element';
import { checkIsRutElement, formatValue } from '../helpers';
import { MatchResult } from '../types';

/**
 * Check that an element has a React `key` that matches the provided value.
 */
export default function toHaveKey(element: Element, value: string | number): MatchResult {
  checkIsRutElement(element);

  // @ts-ignore Allow access for matcher
  const { key } = element.testInstance()._fiber;
  const formattedValue = formatValue(value);

  return {
    message: `expected \`${element}\` to have a ${formattedValue} key`,
    notMessage: `expected \`${element}\` not to have a ${formattedValue} key`,
    passed: key !== null && key === value,
  };
}
