/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-namespace */

import React from 'react';
import Element from './Element';

export interface RendererOptions {
  mockRef?: (element: React.ReactElement) => unknown;
  strict?: boolean;
  wrapper?: React.ReactElement;
}

export interface DebugOptions {
  groupProps?: boolean;
  hostElements?: boolean;
  keyAndRef?: boolean;
  reactElements?: boolean;
  return?: boolean;
  sortProps?: boolean;
}

export interface EmitOptions {
  propagate?: boolean;
}

export type ArgsOf<T> = T extends (...args: infer A) => unknown ? A : never;

export type ReturnOf<T> = T extends (...args: unknown[]) => infer R ? R : unknown;

export type PropsOf<T> = T extends Element<infer P>
  ? P
  : T extends React.ReactElement<infer P>
  ? P
  : T extends React.ComponentType<infer P>
  ? P
  : {};

export interface UnknownProps {
  [name: string]: unknown;
}

export interface TestNode {
  children: (TestNode | string)[];
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

export type Predicate = (node: TestNode, fiber: FiberNode) => boolean;

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

export type HostComponentType = keyof JSX.IntrinsicElements;

export type HostProps<T extends HostComponentType> = JSX.IntrinsicElements[T];

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
      toHaveProp<K extends keyof PropsOf<R>>(name: K, value?: unknown): R;
      toHaveProps(props: Partial<PropsOf<R>>): R;
      toHaveRendered(): R;
      toHaveValue(value: unknown): R;
    }
  }
}
