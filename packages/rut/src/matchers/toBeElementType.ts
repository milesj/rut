import Element from '../Element';
import { formatValue } from '../internals/react';
import { isRutElement } from '../internals/utils';
import { MatchResult } from '../types';

/**
 * Check that an element is a valid React element type.
 * Accepts either a class or function component, or the name of a host component (HTML tag).
 */
export default function toBeElementType(element: Element, type: React.ElementType): MatchResult {
  isRutElement(element);

  // @ts-ignore Allow internal access
  const actualType = element.element.type;
  const typeName = formatValue(type);

  return {
    actual: formatValue(actualType),
    expected: typeName,
    message: `expected {{received}} to be a {{expected}}`,
    name: 'toBeElementType',
    notMessage: `expected {{received}} not to be a {{expected}}`,
    passed: actualType === type,
    received: element.toString(),
  };
}
