import React from 'react';
import Element from '../Element';
import { checkIsRutElement, shallowEqual } from '../internals/helpers';
import { getNodeName } from '../helpers';
import { MatchResult } from '../types';

export default function toContainNode(
  element: Element,
  node: NonNullable<React.ReactNode>,
): MatchResult {
  checkIsRutElement(element);

  const nodeName = getNodeName(node);
  const results = element.query(
    (testNode, fiberNode) => {
      if (React.isValidElement(node)) {
        return (
          testNode.type === node.type &&
          fiberNode.key === node.key &&
          (testNode.props === node.props || shallowEqual(testNode.props, node.props))
        );
      }

      // RTR doesn't run the predicate on non-element nodes (like strings and numbers),
      // so we need to query the parent by traversing the children.
      // https://github.com/facebook/react/blob/master/packages/react-test-renderer/src/ReactTestRenderer.js#L388
      return testNode.children.includes(String(node));
    },
    { deep: false },
  );

  return {
    message: `expected \`${element}\` to contain node \`${nodeName}\``,
    notMessage: `expected \`${element}\` not to contain node \`${nodeName}\``,
    passed: results.length > 0,
  };
}
