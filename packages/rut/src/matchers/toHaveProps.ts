import Element from '../Element';
import { formatValue } from '../helpers';
import { MatchResult, UnknownProps } from '../types';
import { isRutElement, deepEqual } from '../internals/utils';

/**
 * Check that an element's props match all the provided props and their values.
 * Arrays and objects will be matched using deep equality.
 */
export default function toHaveProps(element: Element, props: UnknownProps): MatchResult {
  isRutElement(element);

  const keys = Object.keys(props);
  // @ts-ignore Allow internal access
  const baseProps = element.element.props;
  const invalid: string[] = [];

  keys.forEach(key => {
    if (!deepEqual(baseProps[key], props[key])) {
      invalid.push(formatValue(key));
    }
  });

  return {
    message: `expected {{received}} to have matching props ${keys.join(', ')}`,
    name: 'toHaveProps',
    notMessage: `expected {{received}} not to have matching props ${keys.join(', ')}`,
    passed: equals => (equals ? equals(baseProps, props) : invalid.length === 0),
    received: element.toString(),
  };
}
