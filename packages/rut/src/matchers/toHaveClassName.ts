import Element from '../Element';
import { checkIsRutElement, getProp } from '../internals/helpers';
import { MatchResult } from '../types';

/**
 * Check that an element has a `className` prop that matches the defined value.
 */
export default function toHaveClassName(
  element: Element<{ className?: string }>,
  name: string,
): MatchResult {
  checkIsRutElement(element);

  const className = getProp(element, 'className');

  return {
    message: `expected \`${element}\` to have a "${name}" class name`,
    notMessage: `expected \`${element}\` not to have a "${name}" class name`,
    passed: typeof className === 'string' && className.split(' ').includes(name),
  };
}
