import Element from './Element';
import { doAsyncAct } from './internals/act';
import Result from './Result';
import { RendererOptions } from './types';

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
        void this.renderer.unstable_flushSync(
          () => void this.renderer.update(this.updateElement(element)),
        ),
      this.options.applyPatches,
    );

    return this.root;
  };
}
