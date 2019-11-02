import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';
import Element from './Element';
import { doAct, doAsyncAct } from './internals/act';
import { debug } from './internals/debug';
import { unwrapExoticType } from './internals/element';
import { deepEqual } from './internals/utils';
import { NodeLike } from './internals/react';
import { AdapterRendererOptions, DebugOptions } from './types';

export default class Result<Props extends object = {}> {
  protected element: React.ReactElement<Props>;

  protected readonly renderer: ReactTestRenderer;

  protected options: AdapterRendererOptions;

  private readonly isRutResult = true;

  constructor(element: React.ReactElement<Props>, options: AdapterRendererOptions) {
    this.options = options;
    this.element = element;
    this.renderer = create(
      this.wrapElement(element),
      options.mockRef
        ? {
            createNodeMock: options.mockRef,
          }
        : undefined,
    );
  }

  /**
   * Log and return a JSX representation of the entire *reconciled* React component tree.
   * Does not include exotic components or nodes, such as:
   *
   *  - Context consumers and providers
   *  - Roots, portals, modes
   *  - Profiler, Suspense
   *  - Fragments
   */
  debug = (options: DebugOptions = {}) =>
    debug(this.renderer.root, {
      ...this.options.debugger,
      ...options,
    });

  /**
   * Return the root component as an `Element`.
   */
  get root(): Element<React.ComponentType<Props>> {
    const { element } = this;
    const root = this.options.createElement(this.renderer.root);
    const rootType = unwrapExoticType((element as unknown) as NodeLike);

    // When being wrapped, we need to drill down and find the
    // element that matches the one initially passed in.
    if (this.options.wrapper) {
      const nodes = root.query(
        node => node.type === rootType && deepEqual(node.props, element.props),
      );

      // istanbul ignore next
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
    doAct(() => {
      this.renderer.unmount();
    });
  };

  /**
   * Update the in-memory tree with new props or children. If no props are passed,
   * it will force an update of the current element.
   */
  update = (newPropsOrElement?: Partial<Props>, newChildren?: React.ReactNode) => {
    doAct(() => this.renderer.update(this.updateElement(newPropsOrElement, newChildren)));
  };

  /**
   * Like `update` but also awaits the update so that async calls have time to finish.
   */
  updateAndWait = async (newPropsOrElement?: Partial<Props>, newChildren?: React.ReactNode) => {
    await doAsyncAct(() =>
      this.renderer.unstable_flushSync(() =>
        this.renderer.update(this.updateElement(newPropsOrElement, newChildren)),
      ),
    );
  };

  /**
   * Replace the previous element with a new one. Return the new wrapped element.
   */
  protected updateElement(
    newPropsOrElement?: Partial<Props> | React.ReactElement,
    newChildren?: React.ReactNode,
  ): React.ReactElement {
    const { children } = this.element.props as {
      children?: React.ReactNode;
    };

    this.element = React.isValidElement(newPropsOrElement)
      ? newPropsOrElement
      : React.cloneElement(this.element, newPropsOrElement, newChildren || children);

    return this.wrapElement(this.element);
  }

  /**
   * Wrap the root element with additional elements for convenient composition.
   */
  protected wrapElement(root: React.ReactElement): React.ReactElement {
    const { options } = this;
    let element: React.ReactElement = root;

    // Wrap with another elemnt
    if (options.wrapper) {
      element = React.cloneElement(options.wrapper, {}, element);
    }

    // Wrap with strict mode
    if (options.strict) {
      element = React.createElement(React.StrictMode, {}, element);
    }

    // Wrap with error boundary
    // return React.createElement(ErrorBoundary, {}, element);

    return element;
  }
}
