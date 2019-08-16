/* eslint-disable @typescript-eslint/no-namespace */

import React from 'react';

export type Args<T> = T extends (...args: unknown[]) => unknown ? Parameters<T> : unknown[];

export interface UnknownProps {
  [name: string]: unknown;
}

export interface TestNode {
  children: (TestNode | string)[];
  instance: unknown;
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
  ref: React.RefObject<unknown> | null;
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
  // | 'context-consumer'
  // | 'context-provider'
  | 'forward-ref'
  | 'function-component'
  | 'host-component'
  | 'indeterminate-component'
  | 'fragment'
  | 'lazy'
  | 'memo'
  | 'mode'
  | 'portal'
  | 'profiler'
  | 'root'
  | 'suspense'
  | 'text';

declare module 'react-test-renderer' {
  interface ReactTestInstance {
    _fiber: FiberNode;
  }
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeElementType(type: React.ElementType): R;
      toBeNodeType(type: NodeType): R;
      toContainNode(node: NonNullable<React.ReactNode>): R;
      toRenderChildren(): R;
    }
  }
}
