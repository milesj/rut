import React from 'react';
import AsyncResult from './AsyncResult';
import BaseEvent from './BaseEvent';
import Element from './Element';
import { doAct, doAsyncAct } from './internals/act';
import { globalOptions } from './internals/config';
import SyncResult from './SyncResult';
import SyntheticEvent from './SyntheticEvent';
import { AdapterRendererOptions } from './types';

export { BaseEvent, Element, SyntheticEvent };

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
