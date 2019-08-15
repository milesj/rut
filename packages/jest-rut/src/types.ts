/* eslint-disable */

import React from 'react';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeElementType(type: React.ReactType): R;
      toContainNode(node: NonNullable<React.ReactNode>): R;
      toRenderChildren(): R;
    }
  }
}
