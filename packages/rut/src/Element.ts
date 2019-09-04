/* eslint-disable lines-between-class-members, no-dupe-class-members */

import React from 'react';
import { act, ReactTestInstance } from 'react-test-renderer';
import {
  ArgsOf,
  ReturnOf,
  HostComponentType,
  Predicate,
  EmitOptions,
  DebugOptions,
  UnknownProps,
  HostProps,
} from './types';
import { getTypeName } from './helpers';
import wrapAndCaptureAsync from './internals/async';
import debug from './internals/debug';
import { getPropForEmitting } from './internals/helpers';
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
    window.addEventListener();

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
   * Emit an event listener for the defined prop name. Requires a list of arguments
   * that match the original type, and returns the result of the emit.
   *
   * Note: This may only be executed on host components (DOM elements).
   */
  emit<K extends keyof Props>(
    name: K,
    options: EmitOptions = {},
    ...args: ArgsOf<Props[K]>
  ): ReturnOf<Props[K]> {
    const prop = getPropForEmitting(this, name);
    let value: ReturnOf<Props[K]>;

    // istanbul ignore next
    if (options.propagate) {
      // eslint-disable-next-line no-console
      console.warn('Event propagation is experimental and is not fully implemented.');
    }

    act(() => {
      if (typeof prop === 'function') {
        value = prop(...args);
      }
    });

    // @ts-ignore Value is assigned
    return value;
  }

  /**
   * Like `emit` but also awaits the event so that async calls have time to finish.
   */
  async emitAndWait<K extends keyof Props>(
    name: K,
    options: EmitOptions = {},
    ...args: ArgsOf<Props[K]>
  ): Promise<ReturnOf<Props[K]>> {
    const waitForQueue = wrapAndCaptureAsync();
    const prop = getPropForEmitting(this, name);
    let value: ReturnOf<Props[K]>;

    // istanbul ignore next
    if (options.propagate) {
      // eslint-disable-next-line no-console
      console.warn('Event propagation is experimental and is not fully implemented.');
    }

    await act(async () => {
      if (typeof prop === 'function') {
        value = await prop(...args);
      }
    });

    // We need an additional act as async results may cause re-renders
    await act(async () => {
      await waitForQueue();
    });

    // @ts-ignore Value is assigned
    return value;
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If any are found, a list of `Element`s is returned.
   */
  find<T extends HostComponentType, P = HostProps<T>>(type: T, props?: Partial<P>): Element<P>[];
  find<P>(type: React.ComponentType<P>, props?: Partial<P>): Element<P>[];
  find(type: React.ElementType<unknown>, props?: UnknownProps): Element<unknown>[] {
    return this.query(whereTypeAndProps(type, props));
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If exactly 1 is found, a `Element`s is returned,
   * otherwise an error is thrown.
   */
  findOne<T extends HostComponentType, P = HostProps<T>>(type: T, props?: Partial<P>): Element<P>;
  findOne<P>(type: React.ComponentType<P>, props?: Partial<P>): Element<P>;
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
