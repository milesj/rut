/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-namespace */

import React from 'react';
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

export type InferEventFromHandler<T> = T extends (event: infer E) => void ? E : never;

export type InferHostElementFromEvent<T> = T extends React.SyntheticEvent<infer E> ? E : Element;

export type EventMap<T> = Required<
  Omit<React.DOMAttributes<T>, 'children' | 'dangerouslySetInnerHTML'>
>;

export type EventType = keyof EventMap<unknown>;

export type EventOptions<T, E> = {
  currentTarget?: Partial<T>;
  target?: Partial<T>;
} & ExpandedEventOptions<E>;

export type ExpandedEventOptions<T> = T extends React.AnimationEvent | AnimationEvent
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

// AUGMENTATION

export type PropsOf<T> = T extends RutResult<infer P>
  ? P
  : T extends RutElement<infer E>
  ? InferComponentProps<E>
  : {};

export type StructureOf<T> = { [K in keyof T]: T[K] };

declare module 'react-test-renderer' {
  interface ReactTestInstance {
    _fiber: FiberNode;
  }
}

declare global {
  namespace jest {
    interface Matchers<R, P = PropsOf<R>> {
      toBeChecked(): R;
      toBeDisabled(): R;
      toBeElementType(type: React.ElementType): R;
      toBeNodeType(type: NodeType): R;
      toContainNode(node: NonNullable<React.ReactNode>): R;
      toHaveClassName(name: string): R;
      toHaveKey(value: string | number): R;
      toHaveProp<K extends keyof P>(name: K, value?: P[K]): R;
      toHaveProps(props: Partial<P>): R;
      toHaveRendered(): R;
      toHaveValue(value: unknown): R;
    }
  }
}
