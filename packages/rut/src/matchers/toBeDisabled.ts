import Element from '../Element';
import toHaveProp from './toHaveProp';
import { MatchResult } from '../types';

export default function toBeDisabled(element: Element): MatchResult {
  return toHaveProp(element, 'disabled', true);
}
