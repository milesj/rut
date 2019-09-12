/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-namespace */

import React from 'react';

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

export interface DebugOptions {
  /** Group props into the following: key & ref, truthy booleans, everything
  else, event handlers. Defaults to `true`. */
  groupProps?: boolean;
  /** Include host elements (DOM) in the output. Defaults to `true`. */
  hostElements?: boolean;
  /** Include `key` and `ref` props in the output. Defaults to `true`. */
  keyAndRef?: boolean;
  /** Max length of arrays and objects before truncating. Defaults to 5. */
  maxLength?: number;
  /** Do not render children. Defaults to `false`. */
  noChildren?: boolean;
  /** Include React elements in the output. Defaults to `true`. */
  reactElements?: boolean;
  /** Do not log to the console and instead return the output. Defaults to
  `false`. */
  return?: boolean;
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

export interface MatchResult {
  context?: string;
  message: string;
  notMessage: string;
  passed: boolean;
}

export type NodeType =
  | 'class-component'
  | 'forward-ref'
  | 'function-component'
  | 'host-component'
  | 'memo';

// COMPONENTS

export type HostComponentType = keyof JSX.IntrinsicElements;

export type InferHostElement<T> = T extends keyof HTMLElementTagNameMap
  ? HTMLElementTagNameMap[T]
  : T extends keyof SVGElementTagNameMap
  ? SVGElementTagNameMap[T]
  : unknown;

export type InferComponentProps<T> = T extends HostComponentType
  ? JSX.IntrinsicElements[T]
  : T extends React.ComponentType<infer P>
  ? P
  : {};

// EVENTS

export type InferEventFromHandler<K extends EventType, T> = EventMap<T>[K] extends (
  event: infer E,
) => void
  ? E
  : never;

export type InferHostElementFromEvent<T> = T extends React.SyntheticEvent<infer E> ? E : Element;

export type InferEventOptions<T> = T extends React.AnimationEvent | AnimationEvent
  ? { animationName?: string }
  : T extends
      | React.MouseEvent
      | React.KeyboardEvent
      | React.TouchEvent
      | MouseEvent
      | KeyboardEvent
      | TouchEvent
  ? {
      altKey?: boolean;
      ctrlKey?: boolean;
      key?: string;
      keyCode?: number;
      metaKey?: boolean;
      shiftKey?: boolean;
    }
  : T extends React.TransitionEvent | TransitionEvent
  ? { propertyName?: string }
  : {};

export type EventMap<T> = Omit<React.DOMAttributes<T>, 'children' | 'dangerouslySetInnerHTML'>;

export type EventType = keyof EventMap<unknown>;

export type EventOptions<T, E> = {
  currentTarget?: Partial<T>;
  target?: Partial<T>;
} & InferEventOptions<E>;

// AUGMENTATION

export type StructureOf<T> = { [K in keyof T]: T[K] };

declare module 'react-test-renderer' {
  interface ReactTestInstance {
    _fiber: FiberNode;
  }
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeChecked(): R;
      toBeDisabled(): R;
      toBeElementType(type: React.ElementType): R;
      toBeNodeType(type: NodeType): R;
      toContainNode(node: NonNullable<React.ReactNode>): R;
      toHaveClassName(name: string): R;
      toHaveKey(value: string | number): R;
      toHaveProp<K extends keyof InferComponentProps<R>>(name: K, value?: unknown): R;
      toHaveProps(props: Partial<InferComponentProps<R>>): R;
      toHaveRendered(): R;
      toHaveValue(value: unknown): R;
    }
  }
}
