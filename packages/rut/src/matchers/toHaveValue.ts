import Element from '../Element';
import toHaveProp from './toHaveProp';
import { MatchResult } from '../types';
import { checkIsRutElement } from '../helpers';

/**
 * Check that an element has a `value` or `defaultValue` prop that
 * matches the provided value.
 */
export default function toHaveValue(element: Element, value: unknown): MatchResult {
  checkIsRutElement(element);

  const defaultValue = element.prop('defaultValue');
  const propValue = element.prop('value');
  let name = '';

  if (defaultValue !== undefined) {
    name = 'defaultValue';
  }

  if (propValue !== undefined || defaultValue === undefined) {
    name = 'value';
  }

  return toHaveProp(element, name, value);
}
