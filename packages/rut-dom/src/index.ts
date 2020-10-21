/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { RendererOptions, doRender, doRenderAndWait } from 'rut';
import DomElement from './DomElement';

export * from 'rut';
export * from './mocks';
export * from './types';
export { DomElement };

// Rut needs to support portals, but they aren't supported
// in `react-test-renderer` because they're DOM only.
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
    // Nothing
  }

  ReactDOM.createPortal = (children) => children;
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
  };
}

export function render<Props extends object = {}>(
  element: React.ReactElement,
  options?: RendererOptions,
) /* infer */ {
  return doRender<Props, DomElement<React.ComponentType<Props>, Props>>(element, {
    ...options,
    applyPatches,
    createElement: (instance) => new DomElement(instance),
  });
}

export function renderAndWait<Props extends object = {}>(
  element: React.ReactElement,
  options?: RendererOptions,
) /* infer */ {
  return doRenderAndWait<Props, DomElement<React.ComponentType<Props>, Props>>(element, {
    ...options,
    applyPatches,
    createElement: (instance) => new DomElement(instance),
  });
}
