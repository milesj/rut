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
    message: `expected \`${element}\` to have rendered children`,
    notMessage: `expected \`${element}\` not to have rendered children`,
    passed: element.children().length > 0,
  };
}
