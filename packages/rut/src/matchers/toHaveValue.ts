import Element from '../Element';
import { getProp } from '../internals/element';
import { isRutElement } from '../internals/utils';
import { MatchResult } from '../types';
import toHaveProp from './toHaveProp';

/**
 * Check that an element has a `value` or `defaultValue` prop that
 * matches the provided value.
 */
export default function toHaveValue(element: Element, value: unknown): MatchResult {
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

  const result = toHaveProp(element, name, value);
  result.name = 'toHaveValue';

  return result;
}
