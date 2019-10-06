/* eslint-disable complexity */

import React from 'react';
import * as ReactIs from 'react-is';
import { UnknownProps } from './types';
import { doAsyncAct } from './internals/act';

export interface NodeLike {
  $$typeof: symbol | number;
  type?: NodeLike;
  props?: UnknownProps;
}

export interface ContextLike extends NodeLike {
  _context: {
    displayName?: string;
  };
}

export interface PortalLike extends NodeLike {
  containerInfo: HTMLElement;
}

/**
 * Return true if the value is either a React class or component declaration.
 */
export function isReactComponent(value: unknown): value is React.ComponentType {
  return typeof value === 'function';
}

/**
 * Return true if the value is a React class component instance.
 */
export function isReactComponentInstance(value: unknown): value is Function {
  return (
    typeof value === 'object' && !!value && 'isReactComponent' in value && 'constructor' in value
  );
}

/**
 * Return true if the value is structurally similar to a React element or node,
 * by checking for the existance of `$$typeof`.
 */
export function isReactNodeLike(value: unknown): value is NodeLike {
  return typeof value === 'object' && !!value && '$$typeof' in value;
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

  if (isReactComponentInstance(type)) {
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
 * Format a value for use within error messages.
 */
export function formatValue(value: unknown): string {
  const typeOf = typeof value;

  if (typeOf === 'string') {
    return `"${value}"`;
  } else if (typeOf === 'number' || typeOf === 'boolean' || value === null || value === undefined) {
    return `\`${String(value)}\``;
  }

  return `\`${getTypeName(value)}\``;
}

/**
 * Wait for async calls to finish by delaying execution.
 */
export async function wait(delay: number = 10): Promise<void> {
  await doAsyncAct(async () => {
    await new Promise(resolve => {
      setTimeout(resolve, delay);
    });
  });
}
