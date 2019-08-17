import Element from '../Element';
import toHaveProp from './toHaveProp';
import { MatchResult } from '../types';

/**
 * Check that an element has a truthy `disabled` prop.
 */
export default function toBeDisabled(element: Element): MatchResult {
  return toHaveProp(element, 'disabled', true);
}
