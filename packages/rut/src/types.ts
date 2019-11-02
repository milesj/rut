/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-namespace */

import React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import RutElement from './Element';
import RutResult from './Result';

export interface RendererOptions {
  /** Options to pass to the debugger. */
  debugger?: DebugOptions;
  /** Mock a ref found within the current render tree. */
  mockRef?: (element: React.ReactElement) => unknown;
  /** Wraps the root element in `React.StrictMode`. */
  strict?: boolean;
  /** Wraps the root element in the provided React element. */
  wrapper?: React.ReactElement;
}

export interface AdapterRendererOptions extends RendererOptions {
  /** Wrap a react test instance with a Rut element. */
  createElement: (instance: ReactTestInstance) => RutElement;
}

export interface DebugOptions {
  /** Render children. Defaults to `true`. */
  children?: boolean;
  /** Group props into the following: key & ref, truthy booleans, everything
  else, event handlers. Defaults to `true`. */
  groupProps?: boolean;
  /** Include host elements (DOM) in the output. Defaults to `true`. */
  hostElements?: boolean;
  /** Include `key` and `ref` props in the output. Defaults to `true`. */
  keyAndRef?: boolean;
  /** Log to the console automatically. Defaults to `true`. */
  log?: boolean;
  /** Max length of arrays and objects before truncating. Defaults to 5. */
  maxLength?: number;
  /** Include React elements in the output. Defaults to `true`. */
  reactElements?: boolean;
  /** Sort the props within each grouping from A-Z. Defaults to `true`. */
  sortProps?: boolean;
}

export interface DispatchOptions {
  /**
   * Traverse up or down the tree and dispatch the event on every node
   * unless propagation has been stopped.
   */
  propagate?: boolean;
}

export interface QueryOptions {
  /** Search through the entire React trender tree. */
  deep?: boolean;
}

export interface IntegrationOptions {
  /** Execute the callback and flush all timers before returning. */
  runWithTimers: <T>(cb: () => T) => T;
}

export interface UnknownProps {
  [name: string]: unknown;
}

export interface TestNode {
  children: string | (TestNode | string)[];
  instance: {
    context: object;
    props: UnknownProps;
    refs: { [key: string]: any };
    state: object;
  } | null;
  parent: TestNode | null;
  props: UnknownProps;
  type: React.ElementType;
}

export interface FiberNode {
  child: FiberNode | null;
  elementType: React.ElementType;
  index: number;
  key: string | null;
  mode: number;
  ref: any;
  return: FiberNode | null;
  sibling: FiberNode | null;
  tag: number;
  type: React.ElementType;
}

// QUERY

export type AtIndexType = 'first' | 'last' | number;

export type Predicate = (node: TestNode, fiber: FiberNode) => boolean;

// MATCHERS

export type MatchComparator = (a: unknown, b: unknown) => boolean;

export interface MatchResult {
  actual?: unknown;
  diff?: boolean;
  expected?: unknown;
  message: string;
  name: string;
  notMessage: string;
  passed: boolean | ((comp?: MatchComparator) => boolean);
  received: string;
}

export type NodeType =
  | 'class-component'
  | 'forward-ref'
  | 'function-component'
  | 'host-component'
  | 'memo';

// AUGMENTATION

export type PropsOf<T> = T extends RutResult<infer P>
  ? P
  : T extends RutElement<any, infer P>
  ? P
  : {};

declare module 'react-test-renderer' {
  interface ReactTestRenderer {
    // eslint-disable-next-line @typescript-eslint/camelcase
    unstable_flushSync<T>(cb: () => T): T;
  }

  interface ReactTestInstance {
    _fiber: FiberNode;
  }
}

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeChecked(): R;
      toBeDisabled(): R;
      toBeElementType(type: React.ElementType): R;
      toBeNodeType(type: NodeType): R;
      toContainNode(node: NonNullable<React.ReactNode>): R;
      toHaveClassName(name: string): R;
      toHaveKey(value: string | number): R;
      toHaveProp<K extends keyof PropsOf<T>>(name: K, value?: PropsOf<T>[K]): R;
      toHaveProps(props: Partial<PropsOf<T>>): R;
      toHaveRendered(): R;
      toHaveValue(value: unknown): R;
    }
  }
}
