/* eslint-disable lines-between-class-members, no-dupe-class-members */

import React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import {
  ArgsOf,
  ReturnOf,
  HostComponentType,
  Predicate,
  DispatchOptions,
  DebugOptions,
  UnknownProps,
  HostProps,
  AtIndexType,
} from './types';
import { getTypeName } from './helpers';
import { doAct, doAsyncAct } from './internals/act';
import { debug } from './internals/debug';
import { getPropForDispatching } from './internals/element';
import { whereTypeAndProps } from './predicates';

export default class Element<Props = {}> {
  readonly isRutElement = true;

  private element: ReactTestInstance;

  constructor(element: ReactTestInstance) {
    this.element = element;
  }

  /**
   * Return all children as a list of strings and `Element`s.
   */
  children(): (string | Element)[] {
    return this.element.children.map(child =>
      typeof child === 'string' ? child : new Element(child),
    );
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
  debug = (options: DebugOptions = {}) => {
    const output = debug(this.element, options);

    // istanbul ignore next
    if (!options.return) {
      // eslint-disable-next-line no-console
      console.log(output);
    }

    return output;
  };

  /**
   * Dispatch an event listener for the defined prop name. Requires a list of arguments
   * that match the original type, and returns the result of the dispatch.
   *
   * Note: This may only be executed on host components (DOM elements).
   */
  dispatch<K extends keyof Props>(
    name: K,
    options: DispatchOptions = {},
    ...args: ArgsOf<Props[K]>
  ): ReturnOf<Props[K]> {
    const prop = getPropForDispatching(this, name);

    // istanbul ignore next
    if (options.propagate) {
      // eslint-disable-next-line no-console
      console.warn('Event propagation is experimental and is not fully implemented.');
    }

    // @ts-ignore We know its a function
    return doAct(() => prop(...args));
  }

  /**
   * Like `dispatch` but also awaits the event so that async calls have time to finish.
   */
  async dispatchAndWait<K extends keyof Props>(
    name: K,
    options: DispatchOptions = {},
    ...args: ArgsOf<Props[K]>
  ): Promise<ReturnOf<Props[K]>> {
    const prop = getPropForDispatching(this, name);

    // istanbul ignore next
    if (options.propagate) {
      // eslint-disable-next-line no-console
      console.warn('Event propagation is experimental and is not fully implemented.');
    }

    // @ts-ignore We know its a function
    return doAsyncAct(() => prop(...args));
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If any are found, a list of `Element`s is returned.
   */
  find<T extends HostComponentType, P = HostProps<T>, PP = Partial<P>>(
    type: T,
    props?: PP,
  ): Element<P>[];
  find<P, PP = Partial<P>>(type: React.ComponentType<P>, props?: PP): Element<P>[];
  find(type: React.ElementType<unknown>, props?: UnknownProps): Element<unknown>[] {
    return this.query(whereTypeAndProps(type, props));
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If any are found, return the `Element` at the defined
   * index. Accepts shorthand `first` and `last` indices.
   */
  findAt<T extends HostComponentType, P = HostProps<T>, PP = Partial<P>>(
    type: T,
    at: AtIndexType,
    props?: PP,
  ): Element<P>;
  findAt<P, PP = Partial<P>>(type: React.ComponentType<P>, at: AtIndexType, props?: PP): Element<P>;
  findAt(
    type: React.ElementType<unknown>,
    at: AtIndexType,
    props?: UnknownProps,
  ): Element<unknown> {
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
  findOne<T extends HostComponentType, P = HostProps<T>, PP = Partial<P>>(
    type: T,
    props?: PP,
  ): Element<P>;
  findOne<P, PP = Partial<P>>(type: React.ComponentType<P>, props?: PP): Element<P>;
  findOne(type: React.ElementType<unknown>, props?: UnknownProps): Element<unknown> {
    const results = this.find(type, props);

    if (results.length !== 1) {
      throw new Error(
        `Expected to find 1 element for \`${getTypeName(type)}\`, found ${results.length}.`,
      );
    }

    return results[0];
  }

  /**
   * Return the name of the component, element, or node.
   */
  name(): string {
    // Use the raw fiber types for names, as they preserve the internal node structures
    return getTypeName(this.element._fiber.elementType || this.element._fiber.type);
  }

  /**
   * Search through the current child tree using a custom predicate, which is passed the
   * ReactTestRenderer node and internal React fiber node. If any are found,
   * a list of `Element`s is returned.
   */
  query<P = {}>(predicate: Predicate, options?: { deep?: boolean }): Element<P>[] {
    return this.element
      .findAll(node => predicate(node, node._fiber), { deep: true, ...options })
      .map(node => new Element(node));
  }

  /**
   * Return a ref associated with the current component.
   * If a ref is stored on the internal fiber node, it will be returned.
   * Otherwise an instance, callback, or string ref may be referenced by name.
   */
  ref<T>(name?: string): T | null {
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
    return this.name();
  }
}
