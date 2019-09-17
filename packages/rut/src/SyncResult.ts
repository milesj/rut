import Result from './Result';
import { RendererOptions } from './types';
import { doAct } from './internals/act';

export default class SyncResult<Props extends object = {}> extends Result<Props> {
  /**
   * Re-render the in-memory tree with a new element and optional options. This
   * simulates a React update at the root. If the new element has the same type and key as
   * the previous element, the tree will be updated; otherwise, it will mount a new tree.
   *
   * Returns the new root as an `Element`.
   */
  rerender = (element: React.ReactElement<Props>, options?: RendererOptions) => {
    Object.assign(this.options, options);

    doAct(() => this.renderer.update(this.updateElement(element)));

    return this.root;
  };
}
