import Element from '../Element';
import { formatValue } from '../internals/react';
import { isRutElement } from '../internals/utils';
import { ElementType, MatchResult } from '../types';

/**
 * Check that an element is a valid React element type.
 * Accepts either a class or function component, or the name of a host component (HTML tag).
 */
export default function toBeElementType(element: Element, type: ElementType): MatchResult {
  isRutElement(element);

  // @ts-expect-error Allow internal access
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
