/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import { getTypeName } from './internals/react';
import { doAct, doAsyncAct } from './internals/act';
import { debug } from './internals/debug';
import { getPropForDispatching } from './internals/element';
import { whereTypeAndProps } from './predicates';
import {
  Predicate,
  DispatchOptions,
  DebugOptions,
  UnknownProps,
  AtIndexType,
  QueryOptions,
  AdapterRendererOptions,
  ElementType,
} from './types';

export default abstract class Element<
  Type extends ElementType = ElementType,
  Props = never,
  Host = unknown
> {
  // @ts-expect-error Set after instantiation
  options: AdapterRendererOptions;

  protected element: ReactTestInstance;

  private readonly isRutElement = true;

  constructor(element: ReactTestInstance) {
    this.element = element;
  }

  /**
   * Log and return a JSX representation of the current *reconciled* React component tree.
   * Does not include exotic components or nodes, such as:
   *
   *  - Context consumers and providers
   *  - Roots, portals, modes
   *  - Profiler, Suspense
   *  - Fragments
   */
  debug = (options: DebugOptions = {}) => debug(this.element, options);

  /**
   * Dispatch an event listener for the defined prop name. Requires a synthetic event
   * based on the original event type.
   *
   * Note: This may only be executed on host components.
   */
  dispatch(name: string, eventOrConfig?: unknown, options: DispatchOptions = {}): this {
    const prop = getPropForDispatching(this, name);
    const event = this.createSyntheticEvent(name, eventOrConfig, this.element.type);

    // istanbul ignore next
    if (options.propagate) {
      // eslint-disable-next-line no-console
      console.warn('Event propagation is experimental and is not fully implemented.');
    }

    doAct(() => prop(event), this.options.applyPatches);

    return this;
  }

  /**
   * Like `dispatch` but also awaits the event so that async calls have time to finish.
   */
  async dispatchAndWait(
    name: string,
    eventOrConfig?: unknown,
    options: DispatchOptions = {},
  ): Promise<void> {
    const prop = getPropForDispatching(this, name);
    const event = this.createSyntheticEvent(name, eventOrConfig, this.element.type);

    // istanbul ignore next
    if (options.propagate) {
      // eslint-disable-next-line no-console
      console.warn('Event propagation is experimental and is not fully implemented.');
    }

    await doAsyncAct(() => prop(event), this.options.applyPatches);
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If any are found, a list of `Element`s is returned.
   */
  find(type: ElementType, props?: UnknownProps): Element<ElementType>[] {
    return this.query(whereTypeAndProps(type, props));
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If any are found, return the `Element` at the defined
   * index. Accepts shorthand `first` and `last` indices.
   */
  findAt(type: ElementType, at: AtIndexType, props?: UnknownProps): Element<ElementType> {
    const results = this.query(whereTypeAndProps(type, props));
    let index: number;

    if (at === 'first') {
      index = 0;
    } else if (at === 'last') {
      index = results.length - 1;
    } else if (typeof at === 'number') {
      index = at;
    } else {
      throw new TypeError(`Invalid index type "${at}".`);
    }

    const value = results[index];

    if (!value) {
      throw new Error(
        `Expected to find an element at index ${index} for \`${getTypeName(type)}\`.`,
      );
    }

    return value;
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If exactly 1 is found, a `Element`s is returned,
   * otherwise an error is thrown.
   */
  findOne(type: ElementType, props?: UnknownProps): Element<ElementType> {
    const results = this.find(type, props);

    if (results.length !== 1) {
      throw new Error(
        `Expected to find 1 element for \`${getTypeName(type)}\`, found ${results.length}.`,
      );
    }

    return results[0];
  }

  /**
   * Return the name of the component, element, or node as JSX.
   */
  name(jsx: boolean = false): string {
    // Use the raw fiber types for names, as they preserve the internal node structures
    const name = getTypeName(this.element._fiber.elementType || this.element._fiber.type);

    return jsx ? `<${name} />` : name;
  }

  /**
   * Search through the current child tree using a custom predicate, which is passed the
   * ReactTestRenderer node and internal React fiber node. If any are found,
   * a list of `Element`s is returned.
   */
  query<T extends ElementType>(predicate: Predicate, options?: QueryOptions): Element<T>[] {
    return this.element
      .findAll((node) => predicate(node, node._fiber), { deep: true, ...options })
      .map((node) => {
        const element = this.options.createElement(node);

        element.options = this.options;

        return element;
      });
  }

  /**
   * Return a ref associated with the current component.
   * If a ref is stored on the internal fiber node, it will be returned.
   * Otherwise an instance, callback, or string ref may be referenced by name.
   */
  ref<T>(name?: string): T | null {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const inst = this.element.instance;
    const fiber = this.element._fiber;

    if (!name || fiber.ref) {
      return fiber.ref;
    }

    // Callback refs
    if (name in inst) {
      return inst[name];
    }

    // String refs
    if (inst.refs[name]) {
      return inst.refs[name];
    }

    return null;
  }

  /**
   * Return name when cast as a string.
   */
  toString(): string {
    return this.name(true);
  }

  /**
   * Create a synthetic event specific to this renderer.
   */
  abstract createSyntheticEvent(
    name: string,
    eventOrConfig: unknown,
    type: ElementType,
  ): React.SyntheticEvent;
}
