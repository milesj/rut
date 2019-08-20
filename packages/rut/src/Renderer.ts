import React from 'react';
import {
  act,
  create,
  ReactTestRenderer,
  ReactTestRendererJSON,
  ReactTestRendererTree,
} from 'react-test-renderer';
import Element from './Element';
import debug from './debug';
import { UnknownProps, RendererOptions } from './types';
import { getTypeName, shallowEqual } from './helpers';

export default class Renderer<Props = UnknownProps> {
  readonly isRutRenderer = true;

  private element: React.ReactElement<Props>;

  private renderer: ReactTestRenderer;

  private options: RendererOptions;

  constructor(element: React.ReactElement<Props>, options: RendererOptions = {}) {
    this.element = element;
    this.options = options;
    this.renderer = create(this.wrapElement(element), {
      createNodeMock: node => (options.refs && options.refs[getTypeName(node.type)]) || null,
    });
  }

  /**
   * Return a rough JSX representation of the current React component tree.
   * Does not include the following exotic components or nodes:
   *
   *  - Context consumers and providers
   *  - Memo components
   */
  debug(): string {
    return debug(this.toTree());
  }

  /**
   * Return the root component as an `Element`.
   */
  get root(): Element<Props> {
    const { element } = this;
    const root = new Element<Props>(this.renderer.root);

    // When being wrapped, we need to drill down and find the
    // element that matches the one initially passed in.
    if (this.options.wrapper) {
      return root.query<Props>(
        node => node.type === element.type && shallowEqual(node.props, element.props),
      )[0];
    }

    // `StrictMode` does not appear in the rendered tree,
    // so we don't have to worry about handling it.
    return root;
  }

  /**
   * Return an object representing the rendered tree. This tree only contains
   * the platform-specific nodes and their props, but doesn’t contain any user-written
   * components. This is handy for snapshot testing.
   */
  toJSON(): ReactTestRendererJSON | null {
    return this.renderer.toJSON();
  }

  /**
   * Return root element name.
   */
  toString(): string {
    return this.root.toString();
  }

  /**
   * Return an object representing the rendered tree. Unlike `toJSON()`,
   * the representation is more detailed than the one provided by `toJSON()`,
   * and includes the user-written components.
   */
  toTree(): ReactTestRendererTree | null {
    return this.renderer.toTree();
  }

  /**
   * Unmount the in-memory tree, triggering the appropriate lifecycle events.
   */
  async unmount() {
    await act(async () => {
      await this.renderer.unmount();
    });
  }

  /**
   * Re-render the in-memory tree with optional new props or children. This simulates
   * a React update at the root. If the new element has the same type and key as the
   * previous element, the tree will be updated; otherwise, it will mount a new tree.
   */
  async update(newProps?: Partial<Props>, newChildren?: React.ReactNode) {
    const { children } = this.element.props as {
      children?: React.ReactNode;
    };

    // Replace the previous element with a new one
    this.element = React.cloneElement(this.element, newProps, newChildren || children);

    // Act and update the new element
    await act(async () => {
      await this.renderer.update(this.wrapElement(this.element));
    });
  }

  /**
   * Wrap the root element with additional elements for convenient composition.
   */
  private wrapElement(root: React.ReactElement): React.ReactElement {
    let element: React.ReactElement = root;

    // Wrap with another elemnt
    if (this.options.wrapper) {
      element = React.cloneElement(this.options.wrapper, {}, element);
    }

    // Wrap with strict mode
    if (this.options.strict) {
      element = React.createElement(React.StrictMode, {}, element);
    }

    return element;
  }
}
