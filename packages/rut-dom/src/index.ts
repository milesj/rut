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

export function render<Props extends object = {}>(
  element: React.ReactElement,
  options?: RendererOptions,
) {
  return doRender<Props, DomElement<React.ComponentType<Props>, Props>>(element, {
    ...options,
    createElement: instance => new DomElement(instance),
  });
}

export function renderAndWait<Props extends object = {}>(
  element: React.ReactElement,
  options?: RendererOptions,
) {
  return doRenderAndWait<Props, DomElement<React.ComponentType<Props>, Props>>(element, {
    ...options,
    createElement: instance => new DomElement(instance),
  });
}
