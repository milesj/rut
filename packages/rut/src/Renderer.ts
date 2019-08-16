import React from 'react';
import {
  act,
  create,
  ReactTestRenderer,
  ReactTestRendererJSON,
  ReactTestRendererTree,
} from 'react-test-renderer';
import Element from './Element';
import Queryable from './Queryable';
import { UnknownProps } from './types';

export default class Renderer<Props = UnknownProps> extends Queryable {
  private element: React.ReactElement<Props>;

  private renderer: ReactTestRenderer;

  constructor(element: React.ReactElement<Props>) {
    super();

    this.element = element;
    this.renderer = create(element);
  }

  root(): Element<Props> {
    return new Element(this.renderer.root);
  }

  toJSON(): ReactTestRendererJSON | null {
    return this.renderer.toJSON();
  }

  toTree(): ReactTestRendererTree | null {
    return this.renderer.toTree();
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

  protected testInstance() {
    return this.renderer.root;
  }
}
