/* eslint-disable complexity */

import React from 'react';
import * as ReactIs from 'react-is';
import Element from './Element';
import { UnknownProps } from './types';

interface NodeLike {
  $$typeof: symbol | number;
  type?: NodeLike;
  props?: UnknownProps;
}

interface ContextLike extends NodeLike {
  _context: {
    displayName?: string;
  };
}

interface PortalLike extends NodeLike {
  containerInfo: HTMLElement;
}

/**
 * Check that a value is an instance of a Rut `Element`. Used primarily in matchers.
 */
export function checkIsRutElement(value: unknown) {
  if (value instanceof Element) {
    return;
  }

  if (typeof value === 'object' && value !== null && value.constructor.name === 'Element') {
    return;
  }

  throw new Error('Expected a Rut `Element`.');
}

/**
 * Format a value for use within error messages.
 */
export function formatValue(value: unknown): string {
  const typeOf = typeof value;

  if (typeOf === 'string') {
    return `"${value}"`;
  } else if (typeOf === 'number' || typeOf === 'boolean' || value === null) {
    return String(value);
  }

  return `\`${String(value)}\``;
}

/**
 * Return true if the value is either a React class or component declaration.
 */
export function isReactComponent(value: unknown): value is React.ComponentType {
  return typeof value === 'function';
}

/**
 * Return true if the value is structurally similar to a React element or node,
 * by checking for the existance of `$$typeof`.
 */
export function isReactNodeLike(value: unknown): value is NodeLike {
  return typeof value === 'object' && !!value && '$$typeof' in value;
}

/**
 * Return true if the value is a React class component instance.
 */
export function isReactClassInstance(value: unknown): value is Function {
  return (
    typeof value === 'object' && !!value && 'isReactComponent' in value && 'constructor' in value
  );
}

/**
 * Return the `displayName` of a React context node, otherwise return "Context".
 */
export function getContextName(node: NodeLike): string {
  if (node.type) {
    return getContextName(node.type);
  }

  return ('_context' in node && (node as ContextLike)._context.displayName) || 'Context';
}

/**
 * Return the name of a React component, element, or node, by inferring metadata from
 * `$$typeof`. Utilizes the `react-is` package for common scenarios, but also takes
 * into account fibers and nodes not wrapped with React elements.
 */
export function getTypeName(type: unknown): string {
  if (!type) {
    return 'UNKNOWN';
  }

  if (isReactComponent(type)) {
    return type.displayName || type.name;
  }

  if (isReactClassInstance(type)) {
    return getTypeName(type.constructor);
  }

  if (!isReactNodeLike(type) || typeof type === 'string') {
    return String(type);
  }

  const typeOf = type.$$typeof;

  if (ReactIs.isContextConsumer(type) || typeOf === ReactIs.ContextConsumer) {
    return `${getContextName(type)}.Consumer`;
  }

  if (ReactIs.isContextProvider(type) || typeOf === ReactIs.ContextProvider) {
    return `${getContextName(type)}.Provider`;
  }

  if (ReactIs.isForwardRef(type) || typeOf === ReactIs.ForwardRef) {
    return 'ForwardRef'; // We lose the component name
  }

  if (ReactIs.isFragment(type) || typeOf === ReactIs.Fragment) {
    return 'Fragment';
  }

  if (ReactIs.isLazy(type) || typeOf === ReactIs.Lazy) {
    return 'Lazy';
  }

  if (ReactIs.isMemo(type) || typeOf === ReactIs.Memo) {
    return `Memo(${getTypeName(type.type)})`;
  }

  if (ReactIs.isProfiler(type) || typeOf === ReactIs.Profiler) {
    return `Profiler(${type.props!.id})`;
  }

  if (ReactIs.isPortal(type) || typeOf === ReactIs.Portal) {
    const portal = type as PortalLike;

    return `Portal(${portal.containerInfo.id || portal.containerInfo.tagName.toLowerCase()})`;
  }

  if (ReactIs.isStrictMode(type) || typeOf === ReactIs.StrictMode) {
    return 'StrictMode';
  }

  if (ReactIs.isSuspense(type) || typeOf === ReactIs.Suspense) {
    return 'Suspense';
  }

  if (ReactIs.isElement(type)) {
    return getTypeName(type.type);
  }

  return String(type);
}

/**
 * Return the React component, element, or node name, inferred from `getTypeName`,
 * formatted as a JSX element.
 */
export function getNodeName(type: unknown): string {
  // Text node
  if (typeof type === 'string') {
    return `"${type}"`;
  }

  // Component or element nodes
  return `<${getTypeName(type)} />`;
}

// Keep shallow equal in sync with React core!
// https://github.com/facebook/react/blob/master/packages/shared/shallowEqual.js

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
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

export function wait(): Promise<void> {
  return new Promise(resolve => {
    process.nextTick(() => {
      resolve();
    });
  });
}
