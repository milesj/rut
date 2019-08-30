import Element from '../Element';
import { checkIsRutElement } from '../internals/helpers';
import { getTypeName } from '../helpers';
import { MatchResult } from '../types';

/**
 * Check that an element is a valid React element type.
 * Accepts either a class or function component, or the name of a host component (HTML tag).
 */
export default function toBeElementType(element: Element, type: React.ElementType): MatchResult {
  checkIsRutElement(element);

  const typeName = getTypeName(type);

  return {
    message: `expected \`${element}\` to be a \`${typeName}\``,
    notMessage: `expected \`${element}\` not to be a \`${typeName}\``,
    // @ts-ignore Allow internal access
    passed: element.element.type === type,
  };
}
