import Result from './Result';
import { RendererOptions } from './types';
import { doAct } from './internals/act';
import Element from './Element';

export default class SyncResult<
  Props extends object = {},
  Root extends Element = Element
> extends Result<Props, Root> {
  /**
   * Re-render the in-memory tree with a new element and optional options. This
   * simulates a React update at the root. If the new element has the same type and key as
   * the previous element, the tree will be updated; otherwise, it will mount a new tree.
   *
   * Returns the new root as an `Element`.
   */
  rerender = (element: React.ReactElement<Props>, options?: RendererOptions) => {
    Object.assign(this.options, options);

    doAct(() => this.renderer.update(this.updateElement(element)), this.options.applyPatches);

    return this.root;
  };
}
