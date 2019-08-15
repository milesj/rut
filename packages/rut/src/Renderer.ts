import React from 'react';
import { act, create, ReactTestRenderer, ReactTestRendererJSON } from 'react-test-renderer';
import RutElement from './Element';
import Queryable from './Queryable';
import { getTypeName } from './helpers';
import { UnknownProps } from './types';

export default class RutRenderer<Props = UnknownProps> extends Queryable {
  private element: React.ReactElement<Props>;

  private renderer: ReactTestRenderer;

  constructor(element: React.ReactElement<Props>) {
    super();

    this.element = element;
    this.renderer = create(element);
  }

  root(): RutElement<Props> {
    return new RutElement(this.renderer.root);
  }

  toJSON(): ReactTestRendererJSON | null {
    return this.renderer.toJSON();
  }

  toString(): string {
    return getTypeName(this.renderer.root.type);
  }

  async unmount() {
    await act(async () => {
      await this.renderer.unmount();
    });
  }

  async update(props?: Partial<Props>, children?: React.ReactNode) {
    await act(async () => {
      await this.renderer.update(React.cloneElement(this.element, props, children));
    });
  }

  protected node() {
    return this.renderer.root;
  }
}
