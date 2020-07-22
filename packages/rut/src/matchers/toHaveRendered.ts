import Element from '../Element';
import { isRutElement } from '../internals/utils';
import { MatchResult } from '../types';

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
    // @ts-expect-error Allow internal access
    passed: element.element.children.length > 0,
    received: element.toString(),
  };
}
