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

  // @ts-ignore Allow internal access
  const baseProps = element.element.props;
  const formattedKeys: string[] = [];
  let invalid = false;

  Object.keys(props).forEach(key => {
    formattedKeys.push(formatValue(key));

    if (!invalid && !deepEqual(baseProps[key], props[key])) {
      invalid = true;
    }
  });

  return {
    actual: baseProps,
    diff: true,
    expected: props,
    message: `expected {{received}} to have matching props for ${formattedKeys.join(', ')}`,
    name: 'toHaveProps',
    notMessage: `expected {{received}} not to have matching props for ${formattedKeys.join(', ')}`,
    passed: equals => (equals ? equals(baseProps, props) : !invalid),
    received: element.toString(),
  };
}
