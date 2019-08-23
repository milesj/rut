import React from 'react';
import { act } from 'react-test-renderer';
import Renderer from './Renderer';
import { wrapAndCaptureAsync, waitForAsyncQueue } from './async';
import { RendererOptions } from './types';

const globalOptions: RendererOptions = {};

export function render<Props>(
  element: React.ReactElement<Props>,
  options?: RendererOptions,
): Renderer<Props> {
  let renderer: Renderer<Props>;

  act(() => {
    renderer = new Renderer(element, {
      ...globalOptions,
      ...options,
    });
  });

  return renderer!;
}

export async function renderAndWait<Props>(
  element: React.ReactElement<Props>,
  options?: RendererOptions,
): Promise<Renderer<Props>> {
  const queue = wrapAndCaptureAsync();
  let renderer: Renderer<Props>;

  await act(async () => {
    renderer = await new Renderer(element, {
      ...globalOptions,
      ...options,
    });
  });

  // We need an additional act as async results may cause re-renders
  await act(async () => {
    await waitForAsyncQueue(queue);
  });

  return renderer!;
}
