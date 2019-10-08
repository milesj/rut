import React from 'react';

const noop = () => {};
const originalConsoleError = console.error.bind(console);

// React logs errors to the console when an error is thrown,
// even when a boundary exists. Silence it temporarily.
// https://github.com/facebook/react/issues/15520
export function patchConsoleErrors(): () => void {
  console.error = noop;

  return () => {
    console.error = originalConsoleError;
  };
}

interface ReactDOMLike {
  createPortal?: (node: React.ReactNode) => unknown;
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

  ReactDOM.createPortal = function createPortal(node: React.ReactNode) {
    return node;
  };

  ReactDOM.findDOMNode = function findDOMNode() {
    throw new Error('`ReactDOM.findDOMNode()` is not supported by Rut.');
  };

  return () => {
    if (nativeCreatePortal) {
      ReactDOM.createPortal = nativeCreatePortal;
    }

    if (nativeFindNode) {
      ReactDOM.findDOMNode = nativeFindNode;
    }
  };
}
