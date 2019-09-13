import Element from '../Element';
import { getProp } from '../internals/element';
import { formatValue } from '../helpers';
import { MatchResult, UnknownProps } from '../types';
import { isRutElement, deepEqual } from '../internals/utils';

/**
 * Check that an element's props match all the provided props and their values.
 * Arrays and objects will be matched using deep equality.
 */
export default function toHaveProps(element: Element, props: UnknownProps): MatchResult {
  isRutElement(element);

  const invalid: string[] = [];

  Object.entries(props).forEach(([key, value]) => {
    const prop = getProp(element, key);

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
