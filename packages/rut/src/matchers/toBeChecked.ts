import Element from '../Element';
import toHaveProp from './toHaveProp';
import { MatchResult } from '../types';
import { checkIsRutElement } from '../helpers';

/**
 * Check that an element has a truthy `checked` or `defaultChecked` prop.
 */
export default function toBeChecked(
  element: Element<{ checked?: boolean; defaultChecked?: boolean }>,
): MatchResult {
  checkIsRutElement(element);

  const defaultChecked = element.prop('defaultChecked');
  const propChecked = element.prop('checked');
  let name = '';

  if (defaultChecked !== undefined) {
    name = 'defaultChecked';
  }

  if (propChecked !== undefined || defaultChecked === undefined) {
    name = 'checked';
  }

  return toHaveProp(element, name as 'checked', true);
}
