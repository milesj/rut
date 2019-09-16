import Element from '../Element';
import toHaveProp from './toHaveProp';
import { MatchResult } from '../types';
import { getProp } from '../internals/element';
import { isRutElement } from '../internals/utils';

/**
 * Check that an element has a truthy `checked` or `defaultChecked` prop.
 */
export default function toBeChecked(element: Element): MatchResult {
  isRutElement(element);

  const defaultChecked = getProp(element, 'defaultChecked');
  const propChecked = getProp(element, 'checked');
  let name = '';

  if (defaultChecked !== undefined) {
    name = 'defaultChecked';
  }

  if (propChecked !== undefined || defaultChecked === undefined) {
    name = 'checked';
  }

  const result = toHaveProp(element, name, true);
  result.name = 'toBeChecked';

  return result;
}
