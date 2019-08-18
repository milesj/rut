/* eslint-disable no-magic-numbers */

import Element from '../Element';
import { checkIsRutElement } from '../helpers';
import { MatchResult, NodeType } from '../types';

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
  checkIsRutElement(element);

  // @ts-ignore Allow access for matcher
  const fiberTag = element.testInstance()._fiber.tag;
  const nodeToTag = nodeTypeMap[type];

  if (nodeToTag === undefined) {
    throw new Error(
      `toBeNodeType: Invalid node type "${type}", expected one of: ${Object.keys(nodeTypeMap).join(
        ', ',
      )}`,
    );
  }

  return {
    message: `expected \`${element}\` to be a "${type}"`,
    notMessage: `expected \`${element}\` not to be a "${type}"`,
    passed: Array.isArray(nodeToTag) ? nodeToTag.includes(fiberTag) : nodeToTag === fiberTag,
  };
}
