/* eslint-disable no-console */

import React from 'react';
import { deprecate } from './utils';

const noop = () => {};

// React logs errors to the console when an error is thrown,
// even when a boundary exists. Silence it temporarily.
// https://github.com/facebook/react/issues/15520
const nativeConsoleError = console.error.bind(console);

export function patchConsoleErrors(): () => void {
  console.error = noop;

  return () => {
    console.error = nativeConsoleError;
  };
}

// Rut does not use or integrate with `react-dom`,
// but portals are a key technology we need to support.
// The only way to currently handle this is by patching
// the native APIS and restoring later.
interface ReactDOMLike {
  createPortal?: (
    children: React.ReactNode,
    containerInfo: Element,
    key?: null | string,
  ) => unknown;
  findDOMNode?: () => unknown;
}

export function patchReactDOM(): () => void {
  let ReactDOM: ReactDOMLike = {};
  let nativeCreatePortal: ReactDOMLike['createPortal'];
  let nativeFindNode: ReactDOMLike['findDOMNode'];

  try {
    // eslint-disable-next-line
    ReactDOM = require('react-dom');
    nativeCreatePortal = ReactDOM.createPortal;
    nativeFindNode = ReactDOM.findDOMNode;
  } catch {
    // Swallow
  }

  ReactDOM.createPortal = function createPortal(children) {
    // return {
    //   $$typeof: Symbol.for('react.portal'),
    //   children,
    //   containerInfo,
    //   key,
    // };

    return children;
  };

  ReactDOM.findDOMNode = deprecate('ReactDOM.findDOMNode()');

  return () => {
    if (nativeCreatePortal) {
      ReactDOM.createPortal = nativeCreatePortal;
    }

    if (nativeFindNode) {
      ReactDOM.findDOMNode = nativeFindNode;
    }
  };
}
