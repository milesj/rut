import React from 'react';
import { act } from 'react-test-renderer';
import Renderer from './Renderer';
import { RendererOptions } from './types';

export default function render<Props>(
  element: React.ReactElement<Props>,
  options?: RendererOptions,
): Renderer<Props> {
  let renderer: Renderer<Props>;

  act(() => {
    renderer = new Renderer(element, options);
  });

  return renderer!;
}
