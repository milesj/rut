import Element from '../Element';
import { getProp } from '../internals/element';
import { isRutElement } from '../internals/utils';
import { MatchResult } from '../types';
import { formatValue } from '../helpers';

/**
 * Check that an element has a `className` prop that matches the defined value.
 */
export default function toHaveClassName(
  element: Element<{ className?: string }>,
  name: string,
): MatchResult {
  isRutElement(element);

  const className = getProp(element, 'className');
  const actualName = formatValue(className);
  const expectedName = formatValue(name);

  return {
    message: `expected \`${element}\` to have a ${expectedName} class name, has ${actualName}`,
    notMessage: `expected \`${element}\` not to have a ${expectedName} class name, has ${actualName}`,
    passed: typeof className === 'string' && className.split(' ').includes(name),
  };
}
