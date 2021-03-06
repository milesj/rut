/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import { RendererOptions } from 'rut';
import { doRender, doRenderAndWait } from 'rut/lib/adapters';
import DomElement from './DomElement';

export * from './mocks';
export * from './types';
export * from 'rut';
export { DomElement };

// Rut needs to support portals, but they aren't supported
// in `react-test-renderer` because they're DOM only.
// The only way to currently handle this is by patching
// the native APIS and restoring later.

interface ReactDOMLike {
  createPortal?: (
    children: React.ReactNode,
    containerInfo: Element,
    key?: string | null,
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
