import React from 'react';
import Result from './Result';
import { globalOptions } from './configure';
import { doAct, doAsyncAct } from './internals/act';
import { RendererOptions } from './types';

export function render<Props extends object = {}>(
  element: React.ReactElement<Props>,
  options?: RendererOptions,
): Omit<Result<Props>, 'rerenderAndWait'> {
  return doAct(
    () =>
      new Result(element, {
        ...globalOptions,
        ...options,
      }),
  );
}

export async function renderAndWait<Props extends object = {}>(
  element: React.ReactElement<Props>,
  options?: RendererOptions,
): Promise<Omit<Result<Props>, 'rerender'>> {
  return doAsyncAct(
    () =>
      new Result(element, {
        ...globalOptions,
        ...options,
      }),
  );
}
