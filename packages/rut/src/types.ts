/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-namespace */

import React from 'react';

export interface RendererOptions {
  refs?: { [name: string]: unknown };
  strict?: boolean;
}

export type Args<T> = T extends (...args: unknown[]) => unknown ? Parameters<T> : unknown[];

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
      toHaveProp(name: string, value?: unknown): R;
      toHaveRendered(): R;
      toHaveValue(value: unknown): R;
    }
  }
}
