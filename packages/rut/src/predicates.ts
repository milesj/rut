import React from 'react';
import { Predicate, UnknownProps } from './types';

/**
 * Find all elements where the `key` matches the provided name or names.
 */
export function whereKey(value: React.Key | React.Key[]): Predicate {
  return (node, fiber) => (Array.isArray(value) ? value.includes(fiber.key!) : fiber.key === value);
}

/**
 * Find all elements in common with the provided props using shallow equality.
 */
export function whereProps(props: UnknownProps): Predicate {
  return node => Object.keys(props).every(prop => node.props[prop] === props[prop]);
}
