import React from 'react';
import Element from '../Element';
import { isReactNodeLike, NodeLike } from '../helpers';
import { UnknownProps } from '../types';
import { deepEqual } from './utils';

export function getProp<P, K extends keyof P>(element: Element<P>, name: K): P[K] | undefined {
  // @ts-ignore Allow internal access
  return element.element.props[name];
}

export function getPropForDispatching<P, K extends keyof P>(element: Element<P>, name: K): P[K] {
  const prop = getProp(element, name);

  if (!prop) {
    throw new Error(`Prop \`${name}\` does not exist.`);
  } else if (typeof prop !== 'function') {
    throw new TypeError(`Prop \`${name}\` is not a function.`);
    // @ts-ignore Allow internal access
  } else if (typeof element.element.type !== 'string') {
    throw new TypeError('Dispatching events is only allowed on host components (DOM elements).');
  }

  return prop;
}

export function containsProps(props: UnknownProps, contains: UnknownProps): boolean {
  return Object.keys(contains).every(prop => deepEqual(props[prop], contains[prop]));
}

/**
 * Memo and other exotics do not appear in the reconciled tree,
 * so we need to remove it and dig deeper to find the true element type.
 */
export function unwrapExoticType(element: NodeLike): React.ReactElement['type'] {
  const rootType = element.type!;

  if (typeof rootType === 'string' || typeof rootType === 'function') {
    return rootType;
  }

  if (isReactNodeLike(rootType)) {
    return unwrapExoticType(rootType);
  }

  return rootType;
}
