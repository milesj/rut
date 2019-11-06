import Result from './Result';
import { RendererOptions } from './types';
import { doAsyncAct } from './internals/act';
import Element from './Element';

export default class AsyncResult<
  Props extends object = {},
  Root extends Element = Element
> extends Result<Props, Root> {
  /**
   * Like `rerender` but also awaits the re-render so that async calls have time to finish.
   */
  rerenderAndWait = async (element: React.ReactElement<Props>, options?: RendererOptions) => {
    Object.assign(this.options, options);

    await doAsyncAct(
      () =>
        this.renderer.unstable_flushSync(() => this.renderer.update(this.updateElement(element))),
      this.options.applyPatches,
    );

    return this.root;
  };
}
