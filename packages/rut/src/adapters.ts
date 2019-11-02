import React from 'react';
import Element from './Element';
import BaseEvent from './BaseEvent';
import SyntheticEvent from './SyntheticEvent';
import AsyncResult from './AsyncResult';
import SyncResult from './SyncResult';
import { globalOptions } from './internals/config';
import { doAct, doAsyncAct } from './internals/act';
import { AdapterRendererOptions, RendererOptions } from './types';

export { Element, BaseEvent, SyntheticEvent };

export function createAdapter(createElement: AdapterRendererOptions['createElement']) {
  function render<Props extends object = {}>(
    element: React.ReactElement<Props>,
    options?: RendererOptions,
  ): SyncResult<Props> {
    return doAct(
      () =>
        new SyncResult(element, {
          ...globalOptions,
          ...options,
          createElement,
        }),
    );
  }

  async function renderAndWait<Props extends object = {}>(
    element: React.ReactElement<Props>,
    options?: RendererOptions,
  ): Promise<AsyncResult<Props>> {
    return doAsyncAct(
      () =>
        new AsyncResult(element, {
          ...globalOptions,
          ...options,
          createElement,
        }),
    );
  }

  return { render, renderAndWait };
}
