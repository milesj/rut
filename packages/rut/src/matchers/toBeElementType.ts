import Element from '../Element';
import { checkIsRutElement, getTypeName } from '../helpers';
import { MatchResult } from '../types';

/**
 * Check that an element is a valid React element type.
 * Accepts either a class or function component, or the name of a host component (HTML tag).
 */
export default function toBeElementType(element: Element, type: React.ElementType): MatchResult {
  checkIsRutElement(element);

  const expectedName = getTypeName(type);

  return {
    message: `expected \`${element}\` to be a \`${expectedName}\``,
    notMessage: `expected \`${element}\` not to be a \`${expectedName}\``,
    passed: element.type() === type,
  };
}
