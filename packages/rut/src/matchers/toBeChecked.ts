import Element from '../Element';
import toHaveProp from './toHaveProp';
import { MatchResult } from '../types';
import { checkIsRutElement } from '../helpers';

export default function toBeChecked(element: Element): MatchResult {
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

  return toHaveProp(element, name, true);
}
