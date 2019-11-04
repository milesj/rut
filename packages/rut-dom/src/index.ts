/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { RendererOptions } from 'rut';
import { doRender, doRenderAndWait } from 'rut/lib/adapters';
import DomElement from './DomElement';

export * from 'rut';
export * from './mocks';
export * from './types';

// Rut needs to support portals, but they aren't supported
// in `react-test-renderer`, because they're DOM only.
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
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      ReactDOM: ReactDOMLike;
    }
  }
}

function applyPatches(): () => void {
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
  ReactDOM.findDOMNode = () => {
    throw new Error('`ReactDOM.findDOMNode()` is not supported by Rut.');
  };

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

export function render<Props extends object = {}>(
  element: React.ReactElement,
  options?: RendererOptions,
) {
  return doRender<Props, DomElement<React.ComponentType<Props>, Props>>(element, {
    ...options,
    applyPatches,
    createElement: instance => new DomElement(instance),
  });
}

export function renderAndWait<Props extends object = {}>(
  element: React.ReactElement,
  options?: RendererOptions,
) {
  return doRenderAndWait<Props, DomElement<React.ComponentType<Props>, Props>>(element, {
    ...options,
    applyPatches,
    createElement: instance => new DomElement(instance),
  });
}
