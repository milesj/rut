import React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import Element, { INSTANCE } from '../Element';
import { isReactNodeLike, NodeLike } from '../helpers';

export function checkIsRutElement(value: unknown) {
  if (value instanceof Element) {
    return;
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    (value.constructor.name === 'Element' || (value as Element).isRutElement === true)
  ) {
    return;
  }

  throw new Error('Expected a Rut `Element`.');
}

export function getTestInstanceFromElement(element: Element<unknown>): ReactTestInstance {
  console.log('element', element);
  console.log('symbol', INSTANCE);
  console.log('instance', typeof element[INSTANCE]);

  return element[INSTANCE] || {};
}

export function getPropFromElement<P, K extends keyof P>(
  element: Element<P>,
  name: K,
): P[K] | undefined {
  return (getTestInstanceFromElement(element).props as P)[name];
}

export function getPropForEmitting<P, K extends keyof P>(element: Element<P>, name: K): P[K] {
  const prop = getPropFromElement(element, name);

  if (!prop) {
    throw new Error(`Prop \`${name}\` does not exist.`);
  } else if (typeof prop !== 'function') {
    throw new TypeError(`Prop \`${name}\` is not a function.`);
  } else if (typeof getTestInstanceFromElement(element).type !== 'string') {
    throw new TypeError('Emitting events is only allowed on host components (DOM elements).');
  }

  return prop;
}

// Keep shallow equal in sync with React core!
// https://github.com/facebook/react/blob/master/packages/shared/shallowEqual.js
export function shallowEqual(objA: unknown, objB: unknown): boolean {
  if (Object.is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  // eslint-disable-next-line unicorn/no-for-loop
  for (let i = 0; i < keysA.length; i += 1) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      // @ts-ignore
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
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
