import Element from '../Element';
import { checkIsRutElement, getPropFromElement, shallowEqual } from '../internals/helpers';
import { formatValue } from '../helpers';
import { MatchResult } from '../types';

/**
 * Check that an element's props matches all the provided props and their values.
 * Arrays and objects will be matched using shallow equality.
 */
export default function toHaveProps<P>(
  element: Element<P>,
  props: { [K in keyof P]?: P[K] },
): MatchResult {
  checkIsRutElement(element);

  const invalid: string[] = [];

  Object.entries(props).forEach(([key, value]) => {
    const prop = getPropFromElement(element, key as keyof P);

    if (!shallowEqual(prop, value)) {
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
