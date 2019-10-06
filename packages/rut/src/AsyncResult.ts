import Result from './Result';
import { RendererOptions } from './types';
import { doAsyncAct } from './internals/act';

export default class AsyncResult<Props extends object = {}> extends Result<Props> {
  /**
   * Like `rerender` but also awaits the re-render so that async calls have time to finish.
   */
  rerenderAndWait = async (element: React.ReactElement<Props>, options?: RendererOptions) => {
    Object.assign(this.options, options);

    await doAsyncAct(() =>
      this.renderer.unstable_flushSync(() => this.renderer.update(this.updateElement(element))),
    );

    return this.root;
  };
}
