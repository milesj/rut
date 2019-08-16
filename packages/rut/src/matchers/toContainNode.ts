import React from 'react';
import Element from '../Element';
import { checkIsRutElement } from '../helpers';
import { MatchResult } from '../types';

export default function toContainNode(
  element: Element,
  node: NonNullable<React.ReactNode>,
): MatchResult {
  checkIsRutElement(element);

  const results = element.query(
    (testNode, fiberNode) => {
      if (React.isValidElement(node)) {
        return (
          testNode.type === node.type && testNode.props === node.props && fiberNode.key === node.key
        );
      }

      // RTR doesn't run the predicate on non-element nodes (like strings and numbers),
      // so we need to query the parent by traversing the children.
      // https://github.com/facebook/react/blob/master/packages/react-test-renderer/src/ReactTestRenderer.js#L388
      if (testNode.children.includes(String(node))) {
        return true;
      }

      return false;
    },
    { deep: false },
  );

  return {
    message: `expected \`${element}\` to contain node TODO`,
    notMessage: `expected \`${element}\` not to contain node TODO`,
    passed: results.length > 0,
  };
}
