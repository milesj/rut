import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import Element from './Element';
import debug from './debug';
import { wrapAndCaptureAsync, waitForAsyncQueue } from './async';
import { getTypeName, shallowEqual } from './helpers';
import { UnknownProps, RendererOptions } from './types';

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
   * Return a JSX representation of the *reconciled* React component tree.
   * Does not include exotic components or nodes, such as:
   *
   *  - Context consumers and providers
   *  - Memo and forwardRef components
   *  - Roots, portals, modes
   *  - Profiler, Suspense
   *  - Fragments
   */
  debug = () => debug(this.toTree());

  /**
   * Return the root component as an `Element`.
   */
  get root(): Element<Props> {
    const { element } = this;
    const root = new Element<Props>(this.renderer.root);

    // When being wrapped, we need to drill down and find the
    // element that matches the one initially passed in.
    if (this.options.wrapper) {
      const nodes = root.query<Props>(
        node => node.type === element.type && shallowEqual(node.props, element.props),
      );

      if (nodes.length !== 1) {
        throw new Error('Unable to find root node. Wrapping elements may be obfuscating it.');
      }

      return nodes[0];
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
  toJSON = () => this.renderer.toJSON();

  /**
   * Return root element name.
   */
  toString = () => this.root.toString();

  /**
   * Return an object representing the rendered tree. Unlike `toJSON()`,
   * the representation is more detailed than the one provided by `toJSON()`,
   * and includes the user-written components.
   */
  toTree = () => this.renderer.toTree();

  /**
   * Unmount the in-memory tree, triggering the appropriate lifecycle events.
   */
  unmount = () => {
    act(() => {
      this.renderer.unmount();
    });
  };

  /**
   * Re-render the in-memory tree with optional new props or children. This simulates
   * a React update at the root. If the new element has the same type and key as the
   * previous element, the tree will be updated; otherwise, it will mount a new tree.
   */
  update = (newProps?: Partial<Props>, newChildren?: React.ReactNode) => {
    act(() => {
      this.renderer.update(this.updateElement(newProps, newChildren));
    });
  };

  /**
   * Like `update` but also awaits the re-render so that async calls have time to finish.
   */
  updateAndWait = async (newProps?: Partial<Props>, newChildren?: React.ReactNode) => {
    const queue = wrapAndCaptureAsync();

    await act(async () => {
      await this.renderer.update(this.updateElement(newProps, newChildren));
    });

    // We need an additional act as async results may cause re-renders
    await act(async () => {
      await waitForAsyncQueue(queue);
    });
  };

  /**
   * Replace the previous element with a new one. Return the new wrapped element.
   */
  protected updateElement(
    newProps?: Partial<Props>,
    newChildren?: React.ReactNode,
  ): React.ReactElement {
    const { children } = this.element.props as {
      children?: React.ReactNode;
    };

    this.element = React.cloneElement(this.element, newProps, newChildren || children);

    return this.wrapElement(this.element);
  }

  /**
   * Wrap the root element with additional elements for convenient composition.
   */
  protected wrapElement(root: React.ReactElement): React.ReactElement {
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
