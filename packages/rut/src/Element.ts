/* eslint-disable lines-between-class-members, no-dupe-class-members */

import React from 'react';
import { act, ReactTestInstance } from 'react-test-renderer';
import { ArgsOf, ReturnOf, HostComponentType, Predicate, EmitOptions, DebugOptions } from './types';
import { getTypeName } from './helpers';
import wrapAndCaptureAsync from './internals/async';
import debug from './internals/debug';
import { getPropForEmitting } from './internals/helpers';

export const INSTANCE = Symbol('react-test-instance');

export default class Element<Props = {}> {
  readonly isRutElement = true;

  private [INSTANCE]: ReactTestInstance;

  constructor(instance: ReactTestInstance) {
    this[INSTANCE] = instance;
  }

  /**
   * Return all children as a list of strings and `Element`s.
   */
  children(): (string | Element)[] {
    return this[INSTANCE].children.map(child =>
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
  debug(options: DebugOptions = {}) {
    const output = debug(this[INSTANCE], options);

    // istanbul ignore next
    if (!options.return) {
      // eslint-disable-next-line no-console
      console.log(output);
    }

    return output;
  }

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
      console.warn('Event propagation is experimental and is not fully implemented yet.');
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
      console.warn('Event propagation is experimental and is not fully implemented yet.');
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
  find<T extends HostComponentType>(type: T): Element<JSX.IntrinsicElements[T]>[];
  find<P>(type: React.ComponentType<P>): Element<P>[];
  find(type: React.ElementType<unknown>): Element<unknown>[] {
    return this[INSTANCE].findAllByType(type).map(node => new Element(node));
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If exactly 1 is found, a `Element`s is returned,
   * otherwise an error is thrown.
   */
  findOne<T extends HostComponentType>(type: T): Element<JSX.IntrinsicElements[T]>;
  findOne<P>(type: React.ComponentType<P>): Element<P>;
  findOne(type: React.ElementType<unknown>): Element<unknown> {
    const results = this.find(type);

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
    return getTypeName(this[INSTANCE]._fiber.elementType || this[INSTANCE]._fiber.type);
  }

  /**
   * Search through the current child tree using a custom predicate, which is passed the
   * ReactTestRenderer node and internal React fiber node. If any are found,
   * a list of `Element`s is returned.
   */
  query<P = {}>(predicate: Predicate, options?: { deep?: boolean }): Element<P>[] {
    return this[INSTANCE].findAll(node => predicate(node, node._fiber), {
      deep: true,
      ...options,
    }).map(node => new Element(node));
  }

  /**
   * Return a ref associated with the current component.
   * If a ref is stored on the internal fiber node, it will be returned.
   * Otherwise an instance, callback, or string ref may be referenced by name.
   */
  ref<T>(name?: string): T | null {
    const inst = this[INSTANCE].instance;
    const fiber = this[INSTANCE]._fiber;

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
