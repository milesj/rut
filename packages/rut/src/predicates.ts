import React from 'react';
import { ElementType, Predicate, UnknownProps } from './types';
import { containsProps } from './internals/element';

/**
 * Find all elements where the `key` matches the provided name or names.
 */
export function whereKey(value: React.Key | React.Key[]): Predicate {
  return (node, fiber) => (Array.isArray(value) ? value.includes(fiber.key!) : fiber.key === value);
}

/**
 * Find all elements in common with the provided props, regardless of component `type`.
 */
export function whereProps(props: UnknownProps): Predicate {
  return (node) => containsProps(node.props, props);
}

/**
 * Find all elements where the `type` matches the provided type and
 * have in common the provided props.
 */
export function whereTypeAndProps(type: ElementType, props?: UnknownProps): Predicate {
  return (node) => node.type === type && (props ? containsProps(node.props, props) : true);
}
