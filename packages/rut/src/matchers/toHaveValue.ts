import Element from '../Element';
import toHaveProp from './toHaveProp';
import { MatchResult } from '../types';
import { checkIsRutElement, getPropFromElement } from '../internals/helpers';

/**
 * Check that an element has a `value` or `defaultValue` prop that
 * matches the provided value.
 */
export default function toHaveValue(
  element: Element<{ defaultValue?: string; value?: string }>,
  value: unknown,
): MatchResult {
  checkIsRutElement(element);

  const defaultValue = getPropFromElement(element, 'defaultValue');
  const propValue = getPropFromElement(element, 'value');
  let name = '';

  if (defaultValue !== undefined) {
    name = 'defaultValue';
  }

  if (propValue !== undefined || defaultValue === undefined) {
    name = 'value';
  }

  return toHaveProp(element, name as 'value', value);
}
