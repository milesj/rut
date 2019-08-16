import Element from '../Element';
import { checkIsRutElement } from '../helpers';
import { MatchResult } from '../types';

/**
 * Check that a component has either rendered children or `null`.
 */
export default function toRenderChildren(element: Element): MatchResult {
  checkIsRutElement(element);

  return {
    message: `expected \`${element}\` to render children`,
    notMessage: `expected \`${element}\` not to render children`,
    passed: element.children().length > 0,
  };
}
