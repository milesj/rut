import React from 'react';
import Element from './Element';
import AsyncResult from './AsyncResult';
import SyncResult from './SyncResult';
import { globalOptions } from './internals/config';
import { doAct, doAsyncAct } from './internals/act';
import { AdapterRendererOptions } from './types';

export function doRender<Props extends object, Root extends Element>(
  element: React.ReactElement<Props>,
  options: AdapterRendererOptions,
): SyncResult<Props, Root> {
  return doAct(
    () =>
      new SyncResult(element, {
        ...globalOptions,
        ...options,
      }),
    options.applyPatches,
  );
}

export async function doRenderAndWait<Props extends object, Root extends Element>(
  element: React.ReactElement<Props>,
  options: AdapterRendererOptions,
): Promise<AsyncResult<Props, Root>> {
  return doAsyncAct(
    () =>
      new AsyncResult(element, {
        ...globalOptions,
        ...options,
      }),
    options.applyPatches,
  );
}
