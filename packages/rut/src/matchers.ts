/* eslint-disable no-magic-numbers, no-underscore-dangle */

import React from 'react';
import Element from './Element';
import { getTypeName } from './helpers';
import { MatchResult, NodeType } from './types';

function checkIsRutElement(matcher: string, value: unknown) {
  if (value instanceof Element) {
    return;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    Object.getPrototypeOf(value).constructor.name === 'Element' &&
    Object.getPrototypeOf(Object.getPrototypeOf(value)).constructor.name === 'Queryable'
  ) {
    return;
  }

  throw new Error(`${matcher}: Expected a Rut \`Element\`.`);
}

/**
 * Check that an element is a valid React element type.
 * Accepts either a class or function component, or the name of a host component (HTML tag).
 */
export function toBeElementType(received: Element, type: React.ElementType): MatchResult {
  checkIsRutElement('toBeElementType', received);

  const expectedName = getTypeName(type);

  return {
    message: `expected \`${received}\` to be a \`${expectedName}\``,
    notMessage: `expected \`${received}\` not to be a \`${expectedName}\``,
    passed: received.type() === type,
  };
}

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
export function toBeNodeType(received: Element, type: NodeType): MatchResult {
  checkIsRutElement('toBeNodeType', received);

  // @ts-ignore Allow access for matcher
  const fiberTag = received.testInstance()._fiber.tag;
  const nodeToTag = nodeTypeMap[type];

  if (nodeToTag === undefined) {
    throw new Error(
      `toBeNodeType: Invalid node type "${type}", expected one of: ${Object.keys(nodeTypeMap).join(
        ', ',
      )}`,
    );
  }

  return {
    message: `expected \`${received}\` to be a "${type}"`,
    notMessage: `expected \`${received}\` not to be a "${type}"`,
    passed: Array.isArray(nodeToTag) ? nodeToTag.includes(fiberTag) : nodeToTag === fiberTag,
  };
}

export function toContainNode(received: Element, node: NonNullable<React.ReactNode>): MatchResult {
  checkIsRutElement('toContainNode', received);

  const results = received.query(
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
    message: `expected \`${received}\` to contain node TODO`,
    notMessage: `expected \`${received}\` not to contain node TODO`,
    passed: results.length > 0,
  };
}

/**
 * Check that a component has either rendered children or `null`.
 */
export function toRenderChildren(received: Element): MatchResult {
  checkIsRutElement('toRenderChildren', received);

  return {
    message: `expected \`${received}\` to render children`,
    notMessage: `expected \`${received}\` not to render children`,
    passed: received.children().length > 0,
  };
}
