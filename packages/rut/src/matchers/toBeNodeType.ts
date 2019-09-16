import Element from '../Element';
import { MatchResult, NodeType } from '../types';
import { isRutElement } from '../internals/utils';
import { formatValue } from '../helpers';

// Keep in sync with React upstream!
// https://github.com/facebook/react/blob/master/packages/shared/ReactWorkTags.js
const nodeTypeMap: { [K in NodeType]: number | number[] } = {
  'class-component': 1,
  'forward-ref': 11,
  'function-component': 0,
  'host-component': 5,
  memo: [14, 15],
};

/**
 * Check that an element is a specific type of React node.
 * React nodes are based on React fiber work tags.
 */
export default function toBeNodeType(element: Element, type: NodeType): MatchResult {
  isRutElement(element);

  // @ts-ignore Allow internal access
  const fiberTag = element.element._fiber.tag;
  const nodeToTag = nodeTypeMap[type];

  if (nodeToTag === undefined) {
    throw new Error(
      `Invalid node type "${type}", expected one of: ${Object.keys(nodeTypeMap).join(', ')}`,
    );
  }

  const actualTypeName = formatValue(fiberTag);
  const typeName = formatValue(type);

  return {
    actual: actualTypeName,
    expected: typeName,
    message: `expected {{received}} to be a {{expected}}, found {{actual}}`,
    name: 'toBeNodeType',
    notMessage: `expected {{received}} not to be a {{expected}}, found {{actual}}`,
    passed: Array.isArray(nodeToTag) ? nodeToTag.includes(fiberTag) : nodeToTag === fiberTag,
    received: element.toString(),
  };
}
