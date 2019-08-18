import React from 'react';
import { act } from 'react-test-renderer';
import Renderer from './Renderer';
import { UnknownProps, RendererOptions } from './types';

// function render<Comp extends React.Component, Props = Comp['props']>(
//   element: React.ReactElement<Props>,
// ): RutRenderer<Props>;
function render<Props = UnknownProps>(
  element: React.ReactElement<Props>,
  options?: RendererOptions,
): Renderer<Props> {
  let renderer: Renderer<Props>;

  act(() => {
    renderer = new Renderer(element, options);
  });

  return renderer!;
}

export default render;
