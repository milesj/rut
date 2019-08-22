import React from 'react';
import { act } from 'react-test-renderer';
import Renderer from './Renderer';
import { RendererOptions } from './types';
import { wait } from './helpers';

const globalOptions: RendererOptions = {};

export function render<Props>(
  element: React.ReactElement<Props>,
  options: RendererOptions = {},
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
  options: RendererOptions & { delay?: number } = {},
): Promise<Renderer<Props>> {
  let renderer: Renderer<Props>;

  await act(async () => {
    renderer = await new Renderer(element, {
      ...globalOptions,
      ...options,
    });
  });

  // Give a little time for async calls to finish
  await wait(options.delay);

  return renderer!;
}
