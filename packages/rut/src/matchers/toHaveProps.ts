import Element from '../Element';
import { getProp } from '../internals/element';
import { formatValue } from '../helpers';
import { MatchResult } from '../types';
import { isRutElement, deepEqual } from '../internals/utils';

/**
 * Check that an element's props match all the provided props and their values.
 * Arrays and objects will be matched using deep equality.
 */
export default function toHaveProps<P>(
  element: Element<P>,
  props: { [K in keyof P]?: P[K] },
): MatchResult {
  isRutElement(element);

  const invalid: string[] = [];

  Object.entries(props).forEach(([key, value]) => {
    const prop = getProp(element, key as keyof P);

    if (!deepEqual(prop, value)) {
      invalid.push(formatValue(key));
    }
  });

  return {
    message: `expected \`${element}\` to have all props, mismatched are ${invalid.join(', ')}`,
    notMessage: `expected \`${element}\` not to have all props, mismatched are ${invalid.join(
      ', ',
    )}`,
    passed: invalid.length === 0,
  };
}
