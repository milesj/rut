import React from 'react';
import Element from '../Element';
import { debugFromElement } from '../internals/debug';
import { isAllTextNodes, isRutElement, deepEqual } from '../internals/utils';
import { formatValue } from '../helpers';
import { MatchResult } from '../types';

/**
 * Check that an element contains a node (string, element, etc) within its children, at any depth.
 */
export default function toContainNode(
  element: Element,
  node: NonNullable<React.ReactNode>,
): MatchResult {
  isRutElement(element);

  const results = element.query(
    (testNode, fiberNode) => {
      if (React.isValidElement(node)) {
        return (
          testNode.type === node.type &&
          fiberNode.key === node.key &&
          deepEqual(testNode.props, node.props)
        );
      }

      const expected = String(node);
      const { children } = testNode;

      // RTR doesn't run the predicate on non-element nodes (like strings and numbers),
      // so we need to query the parent by traversing the children.
      // https://github.com/facebook/react/blob/master/packages/react-test-renderer/src/ReactTestRenderer.js#L388
      if (children === expected || children.includes(expected)) {
        return true;
      }

      // When interpolation is used within JSX, it causes `children` to be
      // an array of strings, instead of a string. So if all nodes are strings,
      // lets join and compare, to make it easier on the consumer.
      if (Array.isArray(children) && isAllTextNodes(children) && children.join('') === expected) {
        return true;
      }

      return false;
    },
    { deep: false },
  );

  const expectedNode = React.isValidElement(node)
    ? debugFromElement(node, { children: false, log: false })
    : formatValue(node);

  return {
    message: `expected \`${element}\` to contain node ${expectedNode}`,
    notMessage: `expected \`${element}\` not to contain node ${expectedNode}`,
    passed: results.length > 0,
  };
}
