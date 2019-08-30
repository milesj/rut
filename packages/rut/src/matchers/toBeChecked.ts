import Element from '../Element';
import toHaveProp from './toHaveProp';
import { MatchResult } from '../types';
import { checkIsRutElement, getPropFromElement } from '../internals/helpers';

/**
 * Check that an element has a truthy `checked` or `defaultChecked` prop.
 */
export default function toBeChecked(
  element: Element<{ checked?: boolean; defaultChecked?: boolean }>,
): MatchResult {
  checkIsRutElement(element);

  const defaultChecked = getPropFromElement(element, 'defaultChecked');
  const propChecked = getPropFromElement(element, 'checked');
  let name = '';

  if (defaultChecked !== undefined) {
    name = 'defaultChecked';
  }

  if (propChecked !== undefined || defaultChecked === undefined) {
    name = 'checked';
  }

  return toHaveProp(element, name as 'checked', true);
}
