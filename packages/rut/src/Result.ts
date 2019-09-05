import React from 'react';
import { act, create, ReactTestRenderer } from 'react-test-renderer';
import Element from './Element';
import wrapAndCaptureAsync from './internals/async';
import debug from './internals/debug';
import { shallowEqual, unwrapExoticType } from './internals/helpers';
import { RendererOptions, DebugOptions } from './types';
import { NodeLike } from './helpers';

const ELEMENT = Symbol('react-element');
const RENDERER = Symbol('react-test-renderer');

export default class Result<Props = {}> {
  readonly isRutResult = true;

  private [ELEMENT]: React.ReactElement<Props>;

  private [RENDERER]: ReactTestRenderer;

  private options: RendererOptions;

  constructor(element: React.ReactElement<Props>, options: RendererOptions = {}) {
    this.options = options;
    this[ELEMENT] = element;
    this[RENDERER] = create(
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
  debug = (options: DebugOptions = {}) => {
    const output = debug(this[RENDERER].root, options);

    // istanbul ignore next
    if (!options.return) {
      // eslint-disable-next-line no-console
      console.log(output);
    }

    return output;
  };

  /**
   * Return the root component as an `Element`.
   */
  get root(): Element<Props> {
    const element = this[ELEMENT];
    const root = new Element<Props>(this[RENDERER].root);
    const rootType = unwrapExoticType((element as unknown) as NodeLike);

    // When being wrapped, we need to drill down and find the
    // element that matches the one initially passed in.
    if (this.options.wrapper) {
      const nodes = root.query<Props>(
        node => node.type === rootType && shallowEqual(node.props, element.props),
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
  toJSON = () => this[RENDERER].toJSON();

  /**
   * Return root element name.
   */
  toString = () => this.root.toString();

  /**
   * Return an object representing the rendered tree. Unlike `toJSON()`,
   * the representation is more detailed than the one provided by `toJSON()`,
   * and includes the user-written components.
   */
  toTree = () => this[RENDERER].toTree();

  /**
   * Unmount the in-memory tree, triggering the appropriate lifecycle events.
   */
  unmount = () => {
    act(() => {
      this[RENDERER].unmount();
    });
  };

  /**
   * Re-render the in-memory tree with optional new props, children, or element. This
   * simulates a React update at the root. If the new element has the same type and key as
   * the previous element, the tree will be updated; otherwise, it will mount a new tree.
   */
  update = (
    newPropsOrElement?: Partial<Props> | React.ReactElement,
    newChildren?: React.ReactNode,
  ) => {
    act(() => {
      this[RENDERER].update(this.updateElement(newPropsOrElement, newChildren));
    });
  };

  /**
   * Like `update` but also awaits the re-render so that async calls have time to finish.
   */
  updateAndWait = async (
    newPropsOrElement?: Partial<Props> | React.ReactElement,
    newChildren?: React.ReactNode,
  ) => {
    const waitForQueue = wrapAndCaptureAsync();

    await act(async () => {
      await this[RENDERER].update(this.updateElement(newPropsOrElement, newChildren));
    });

    // We need an additional act as async results may cause re-renders
    await act(async () => {
      await waitForQueue();
    });
  };

  /**
   * Replace the previous element with a new one. Return the new wrapped element.
   */
  protected updateElement(
    newPropsOrElement?: Partial<Props> | React.ReactElement,
    newChildren?: React.ReactNode,
  ): React.ReactElement {
    const { children } = this[ELEMENT].props as {
      children?: React.ReactNode;
    };

    this[ELEMENT] = React.isValidElement(newPropsOrElement)
      ? newPropsOrElement
      : React.cloneElement(this[ELEMENT], newPropsOrElement, newChildren || children);

    return this.wrapElement(this[ELEMENT]);
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