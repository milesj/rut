import Element from '../Element';
import { checkIsRutElement } from '../internals/helpers';
import { MatchResult } from '../types';

/**
 * Check that a component has either rendered children or `null`.
 */
export default function toHaveRendered(element: Element): MatchResult {
  checkIsRutElement(element);

  return {
    message: `expected \`${element}\` to have rendered children`,
    notMessage: `expected \`${element}\` not to have rendered children`,
    passed: element.children().length > 0,
  };
}
