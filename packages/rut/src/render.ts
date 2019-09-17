import React from 'react';
import AsyncResult from './AsyncResult';
import SyncResult from './SyncResult';
import { globalOptions } from './configure';
import { doAct, doAsyncAct } from './internals/act';
import { RendererOptions } from './types';

export function render<Props extends object = {}>(
  element: React.ReactElement<Props>,
  options?: RendererOptions,
): SyncResult<Props> {
  return doAct(
    () =>
      new SyncResult(element, {
        ...globalOptions,
        ...options,
      }),
  );
}

export async function renderAndWait<Props extends object = {}>(
  element: React.ReactElement<Props>,
  options?: RendererOptions,
): Promise<AsyncResult<Props>> {
  return doAsyncAct(
    () =>
      new AsyncResult(element, {
        ...globalOptions,
        ...options,
      }),
  );
}
