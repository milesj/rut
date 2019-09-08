import React from 'react';
import { create, ReactTestRenderer } from 'react-test-renderer';
import Element from './Element';
import { doAct, doAsyncAct } from './internals/act';
import debug from './internals/debug';
import { deepEqual, unwrapExoticType } from './internals/helpers';
import { RendererOptions, DebugOptions } from './types';
import { NodeLike } from './helpers';

const ELEMENT = Symbol('react-element');
const RENDERER = Symbol('react-test-renderer');
const OPTIONS = Symbol('result-options');

export default class Result<Props = {}> {
  readonly isRutResult = true;

  private [ELEMENT]: React.ReactElement<Props>;

  private [RENDERER]: ReactTestRenderer;

  private [OPTIONS]: RendererOptions;

  constructor(element: React.ReactElement<Props>, options: RendererOptions = {}) {
    this[OPTIONS] = options;
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
    if (this[OPTIONS].wrapper) {
      const nodes = root.query<Props>(
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
   * Re-render the in-memory tree with a new element and optional options. This
   * simulates a React update at the root. If the new element has the same type and key as
   * the previous element, the tree will be updated; otherwise, it will mount a new tree.
   *
   * Returns the new root as an `Element`.
   */
  rerender = (element: React.ReactElement<Props>, options?: RendererOptions) => {
    Object.assign(this[OPTIONS], options);

    doAct(() => this[RENDERER].update(this.updateElement(element)));

    return this.root;
  };

  /**
   * Like `rerender` but also awaits the re-render so that async calls have time to finish.
   */
  rerenderAndWait = async (element: React.ReactElement<Props>, options?: RendererOptions) => {
    Object.assign(this[OPTIONS], options);

    await doAsyncAct(() => this[RENDERER].update(this.updateElement(element)));

    return this.root;
  };

  /**
   * Unmount the in-memory tree, triggering the appropriate lifecycle events.
   */
  unmount = () => {
    doAct(() => {
      this[RENDERER].unmount();
    });
  };

  /**
   * Update the in-memory tree with new props or children. If no props are passed,
   * it will force an update of the current element.
   */
  update = (newPropsOrElement?: Partial<Props>, newChildren?: React.ReactNode) => {
    doAct(() => this[RENDERER].update(this.updateElement(newPropsOrElement, newChildren)));
  };

  /**
   * Like `update` but also awaits the update so that async calls have time to finish.
   */
  updateAndWait = async (newPropsOrElement?: Partial<Props>, newChildren?: React.ReactNode) => {
    await doAsyncAct(() =>
      this[RENDERER].update(this.updateElement(newPropsOrElement, newChildren)),
    );
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
    const options = this[OPTIONS];
    let element: React.ReactElement = root;

    // Wrap with another elemnt
    if (options.wrapper) {
      element = React.cloneElement(options.wrapper, {}, element);
    }

    // Wrap with strict mode
    if (options.strict) {
      element = React.createElement(React.StrictMode, {}, element);
    }

    return element;
  }
}
