import Element from '../Element';
import { getProp } from '../internals/element';
import { isRutElement } from '../internals/utils';
import { MatchResult } from '../types';
import { formatValue } from '../helpers';

/**
 * Check that an element has a `className` prop that matches the defined value.
 */
export default function toHaveClassName(element: Element, name: string): MatchResult {
  isRutElement(element);

  const className = getProp(element, 'className');
  const actualName = formatValue(className);
  const expectedName = formatValue(name);

  return {
    actual: actualName,
    expected: expectedName,
    message: `expected {{received}} to have a {{expected}} class name, has {{actual}}`,
    name: 'toHaveClassName',
    notMessage: `expected {{received}} not to have a {{expected}} class name, has {{actual}}
    `,
    passed: typeof className === 'string' && className.split(' ').includes(name),
    received: element.toString(),
  };
}
