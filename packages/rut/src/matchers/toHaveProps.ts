import Element from '../Element';
import { formatValue } from '../internals/react';
import { isRutElement, deepEqual } from '../internals/utils';
import { MatchResult, UnknownProps } from '../types';

/**
 * Check that an element's props match all the provided props and their values.
 * Arrays and objects will be matched using deep equality.
 */
export default function toHaveProps(element: Element, props: UnknownProps): MatchResult {
  isRutElement(element);

  // @ts-ignore Allow internal access
  const actualProps = element.element.props;
  const keys = Object.keys(props).map((key) => formatValue(key));

  return {
    actual: actualProps,
    diff: true,
    expected: props,
    message: `expected {{received}} to have matching props for ${keys.join(', ')}`,
    name: 'toHaveProps',
    notMessage: `expected {{received}} not to have matching props for ${keys.join(', ')}`,
    passed: (equals) => (equals ? equals(actualProps, props) : deepEqual(actualProps, props)),
    received: element.toString(),
  };
}
