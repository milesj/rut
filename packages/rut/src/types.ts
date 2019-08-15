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

declare module 'react-test-renderer' {
  interface ReactTestInstance {
    _fiber: FiberNode;
  }
}
