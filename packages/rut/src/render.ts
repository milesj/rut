import React from 'react';
import { act } from 'react-test-renderer';
import Renderer from './Renderer';
import { RendererOptions } from './types';

const globalOptions: RendererOptions = {};

function render<Props>(
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

render.options = globalOptions;

export default render;
