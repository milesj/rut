import Element from '../Element';
import { MatchResult } from '../types';
import toHaveProp from './toHaveProp';

/**
 * Check that an element has a truthy `disabled` prop.
 */
export default function toBeDisabled(element: Element): MatchResult {
  const result = toHaveProp(element, 'disabled', true);
  result.name = 'toBeDisabled';

  return result;
}
