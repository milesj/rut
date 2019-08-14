import React from 'react';
import { act } from 'react-test-renderer';
import RutRenderer from './Renderer';
import { UnknownProps } from './types';

// function render<Comp extends React.Component, Props = Comp['props']>(
//   element: React.ReactElement<Props>,
// ): RutRenderer<Props>;
function render<Props = UnknownProps>(element: React.ReactElement<Props>): RutRenderer<Props> {
  let renderer: RutRenderer<Props>;

  act(() => {
    renderer = new RutRenderer(element);
  });

  return renderer!;
}

export default render;
