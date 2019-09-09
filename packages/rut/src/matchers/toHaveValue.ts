import Element from '../Element';
import toHaveProp from './toHaveProp';
import { MatchResult } from '../types';
import { getProp } from '../internals/element';
import { isRutElement } from '../internals/utils';

/**
 * Check that an element has a `value` or `defaultValue` prop that
 * matches the provided value.
 */
export default function toHaveValue(
  element: Element<{ defaultValue?: string; value?: string }>,
  value: unknown,
): MatchResult {
  isRutElement(element);

  const defaultValue = getProp(element, 'defaultValue');
  const propValue = getProp(element, 'value');
  let name = '';

  if (defaultValue !== undefined) {
    name = 'defaultValue';
  }

  if (propValue !== undefined || defaultValue === undefined) {
    name = 'value';
  }

  return toHaveProp(element, name as 'value', value);
}
