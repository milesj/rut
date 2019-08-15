import React from 'react';
import { getTypeName, Element } from 'rut';
import checkIsRutElement from './checkIsRutElement';

export default function toContainNode(
  this: jest.MatcherUtils,
  received: Element,
  node: NonNullable<React.ReactNode>,
) {
  checkIsRutElement('toContainNode', received);

  const receivedName = getTypeName(received.type());
  const results = received.query(
    (testNode, fiberNode) => {
      if (React.isValidElement(node)) {
        return (
          testNode.type === node.type && testNode.props === node.props && fiberNode.key === node.key
        );
      }

      // RTR doesn't run the predicate on non-element nodes (like strings and numbers)
      // so we need to query the parent by traversing the children.
      // https://github.com/facebook/react/blob/master/packages/react-test-renderer/src/ReactTestRenderer.js#L388
      if (testNode.children.includes(String(node))) {
        return true;
      }

      return false;
    },
    { deep: false },
  );

  if (results.length > 0) {
    return {
      message: () => `expected \`${receivedName}\` not to contain node TODO`,
      pass: true,
    };
  }

  return {
    message: () => `expected \`${receivedName}\` to contain node TODO`,
    pass: false,
  };
}
