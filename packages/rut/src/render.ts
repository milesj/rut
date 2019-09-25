import React from 'react';
import AsyncResult from './AsyncResult';
import SyncResult from './SyncResult';
import { globalOptions } from './configure';
import { doAct, doAsyncAct } from './internals/act';
import { RendererOptions } from './types';

// export function render<Props extends object = {}>(
//   element: React.ReactElement<Props>,
//   options?: RendererOptions,
// ): SyncResult<Props> {
//   const opts = {
//     ...globalOptions,
//     ...options,
//   };

//   return doAct(() => new SyncResult(element, opts));
// }

export async function renderAndWait<Props extends object = {}>(
  element: React.ReactElement<Props>,
  options?: RendererOptions,
): Promise<AsyncResult<Props>> {
  const opts = {
    ...globalOptions,
    ...options,
  };

  return doAsyncAct(() => new AsyncResult(element, opts), opts.asyncMode);
}

export const render = renderAndWait;
