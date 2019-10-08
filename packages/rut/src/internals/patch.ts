/* eslint-disable no-console, @typescript-eslint/no-namespace */

import React from 'react';
import { unsupported } from './utils';

// React logs errors to the console when an error is thrown,
// even when a boundary exists. Silence it temporarily.
// https://github.com/facebook/react/issues/15520
const nativeConsoleError = console.error.bind(console);
const silencedErrors = [/^The above error occurred in the <\w+> component:/u];

export function patchConsoleErrors(): () => void {
  console.error = (message: string) => {
    const silence = silencedErrors.some(pattern => pattern.test(message));

    if (!silence) {
      nativeConsoleError(message);
    }
  };

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

declare global {
  namespace NodeJS {
    interface Global {
      ReactDOM: ReactDOMLike;
    }
  }
}

function patchReactDOM(): () => void {
  let ReactDOM: ReactDOMLike = {};
  let nativeCreatePortal: ReactDOMLike['createPortal'];
  let nativeFindNode: ReactDOMLike['findDOMNode'];

  try {
    // eslint-disable-next-line
    ReactDOM = require('react-dom');
    nativeCreatePortal = ReactDOM.createPortal;
    nativeFindNode = ReactDOM.findDOMNode;
  } catch {
    global.ReactDOM = ReactDOM;
  }

  ReactDOM.createPortal = children => children;
  ReactDOM.findDOMNode = unsupported('ReactDOM.findDOMNode()');

  return () => {
    if (nativeCreatePortal) {
      ReactDOM.createPortal = nativeCreatePortal;
    }

    if (nativeFindNode) {
      ReactDOM.findDOMNode = nativeFindNode;
    }

    if (global.ReactDOM) {
      delete global.ReactDOM;
    }
  };
}

// Support different renderes, like `react-native`, in the future.
export function patchReactRenderer(): () => void {
  return patchReactDOM();
}
