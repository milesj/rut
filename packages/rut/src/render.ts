import React from 'react';
import { act } from 'react-test-renderer';
import Result from './Result';
import wrapAndCaptureAsync from './internals/async';
import { globalOptions } from './configure';
import { RendererOptions } from './types';

export function render<Props = unknown>(
  element: React.ReactElement,
  options?: RendererOptions,
): Omit<Result<Props>, 'rerenderAndWait'> {
  let result: Result<Props>;

  act(() => {
    result = new Result(element, {
      ...globalOptions,
      ...options,
    });
  });

  return result!;
}

export async function renderAndWait<Props = unknown>(
  element: React.ReactElement,
  options?: RendererOptions,
): Promise<Omit<Result<Props>, 'rerender'>> {
  const waitForQueue = wrapAndCaptureAsync();
  let result: Result<Props>;

  await act(async () => {
    result = await new Result(element, {
      ...globalOptions,
      ...options,
    });
  });

  // We need an additional act as async results may cause re-renders
  await act(async () => {
    await waitForQueue();
  });

  return result!;
}
