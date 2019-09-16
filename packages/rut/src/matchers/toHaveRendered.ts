import Element from '../Element';
import { MatchResult } from '../types';
import { isRutElement } from '../internals/utils';

/**
 * Check that a component has rendered children. If a component returns `null`,
 * this will evaluate to false.
 */
export default function toHaveRendered(element: Element): MatchResult {
  isRutElement(element);

  return {
    message: `expected {{received}} to have rendered children`,
    name: 'toHaveRendered',
    notMessage: `expected {{received}} not to have rendered children`,
    // @ts-ignore Allow internal access
    passed: element.element.children.length > 0,
    received: element.toString(),
  };
}
