import React from 'react';
import { act, create, ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';
import RutNode from './Node';
import { UnknownProps } from './types';

export default class RutRenderer<Props> {
  private element: React.ReactElement<Props>;

  private renderer: ReactTestRenderer;

  constructor(element: React.ReactElement<Props>) {
    this.element = element;
    this.renderer = create(element);
  }

  find<P = UnknownProps>(type: React.ReactType<P>): RutNode<P>[] {
    return this.renderer.root.findAllByType(type).map(node => new RutNode(node));
  }

  root(): RutNode<Props> {
    return new RutNode(this.renderer.root);
  }

  toJSON(): ReactTestRendererJSON {
    return this.renderer.toJSON();
  }

  toString(): string {
    const { type } = this.renderer.root;

    if (typeof type === 'string') {
      return type;
    }

    if (typeof type === 'function') {
      return type.name;
    }

    return 'UNKNOWN';
  }

  async unmount() {
    await act(() => {
      this.renderer.unmount();
    });
  }

  async update(props?: Partial<Props>) {
    await act(() => {
      if (props) {
        this.renderer.update(React.cloneElement(this.element, props));
      } else {
        this.renderer.update(this.element);
      }
    });
  }
}
