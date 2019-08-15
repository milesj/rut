import React from 'react';
import { act, create, ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';
import RutElement from './Element';
import { UnknownProps } from './types';

export default class RutRenderer<Props> {
  private element: React.ReactElement<Props>;

  private renderer: ReactTestRenderer;

  constructor(element: React.ReactElement<Props>) {
    this.element = element;
    this.renderer = create(element);
  }

  find<P = UnknownProps>(type: React.ReactType<P>): RutElement<P>[] {
    return this.renderer.root.findAllByType(type).map(node => new RutElement(node));
  }

  root(): RutElement<Props> {
    return new RutElement(this.renderer.root);
  }

  toJSON(): ReactTestRendererJSON | null {
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
    await act(async () => {
      await this.renderer.unmount();
    });
  }

  async update(props?: Partial<Props>) {
    await act(async () => {
      if (props) {
        await this.renderer.update(React.cloneElement(this.element, props));
      } else {
        const inst = this.renderer.getInstance() as React.Component | null;

        if (inst) {
          await inst.forceUpdate();
        }
      }
    });
  }
}
