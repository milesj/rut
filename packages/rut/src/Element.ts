/* eslint-disable lines-between-class-members, no-dupe-class-members, @typescript-eslint/no-explicit-any */

import React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import {
  InferEventFromHandler,
  InferComponentProps,
  HostComponentType,
  Predicate,
  DispatchOptions,
  DebugOptions,
  UnknownProps,
  AtIndexType,
  EventType,
  EventOptions,
  InferHostElement,
  EventMap,
} from './types';
import { getTypeName } from './helpers';
import { doAct, doAsyncAct } from './internals/act';
import { debug } from './internals/debug';
import { getPropForDispatching } from './internals/element';
import { createEvent } from './internals/event';
import { whereTypeAndProps } from './predicates';

type Eventless<T> = Omit<T, 'dispatch' | 'dispatchAndWait'>;

export default class Element<
  Type extends React.ElementType = React.ElementType,
  Host = InferHostElement<Type>
> {
  private readonly isRutElement = true;

  private element: ReactTestInstance;

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
   * Note: This may only be executed on host components (DOM elements).
   */
  dispatch<K extends EventType>(
    name: K,
    event?: InferEventFromHandler<EventMap<Host>[K]>,
    options?: DispatchOptions,
  ): void;
  dispatch<K extends EventType>(
    name: K,
    config?: EventOptions<Host, InferEventFromHandler<EventMap<Host>[K]>>,
    options?: DispatchOptions,
  ): void;
  dispatch<K extends EventType>(
    name: K,
    eventOrConfig?: unknown,
    options: DispatchOptions = {},
  ): void {
    const prop = getPropForDispatching(this, name);
    const event = createEvent(name, eventOrConfig, this.element.type);

    // istanbul ignore next
    if (options.propagate) {
      // eslint-disable-next-line no-console
      console.warn('Event propagation is experimental and is not fully implemented.');
    }

    doAct(() => prop(event));
  }

  /**
   * Like `dispatch` but also awaits the event so that async calls have time to finish.
   */

  async dispatchAndWait<K extends EventType>(
    name: K,
    event?: InferEventFromHandler<EventMap<Host>[K]>,
    options?: DispatchOptions,
  ): Promise<void>;
  async dispatchAndWait<K extends EventType>(
    name: K,
    config?: EventOptions<Host, InferEventFromHandler<EventMap<Host>[K]>>,
    options?: DispatchOptions,
  ): Promise<void>;
  async dispatchAndWait<K extends EventType>(
    name: K,
    eventOrConfig?: unknown,
    options: DispatchOptions = {},
  ): Promise<void> {
    const prop = getPropForDispatching(this, name);
    const event = createEvent(name, eventOrConfig, this.element.type);

    // istanbul ignore next
    if (options.propagate) {
      // eslint-disable-next-line no-console
      console.warn('Event propagation is experimental and is not fully implemented.');
    }

    await doAsyncAct(() => prop(event));
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If any are found, a list of `Element`s is returned.
   */
  find<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): Element<T>[];
  find<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): Eventless<Element<T>>[];
  find(type: React.ElementType<unknown>, props?: UnknownProps): Element<React.ElementType>[] {
    return this.query(whereTypeAndProps(type, props));
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If any are found, return the `Element` at the defined
   * index. Accepts shorthand `first` and `last` indices.
   */
  findAt<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    at: AtIndexType,
    props?: Partial<P>,
  ): Element<T>;
  findAt<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    at: AtIndexType,
    props?: Partial<P>,
  ): Eventless<Element<T>>;
  findAt(
    type: React.ElementType<unknown>,
    at: AtIndexType,
    props?: UnknownProps,
  ): Element<React.ElementType> {
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
  findOne<T extends HostComponentType, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): Element<T>;
  findOne<T extends React.ComponentType<any>, P extends InferComponentProps<T>>(
    type: T,
    props?: Partial<P>,
  ): Eventless<Element<T>>;
  findOne(type: React.ElementType<unknown>, props?: UnknownProps): Element<React.ElementType> {
    const results = this.find(type, props);

    if (results.length !== 1) {
      throw new Error(
        `Expected to find 1 element for \`${getTypeName(type)}\`, found ${results.length}.`,
      );
    }

    // @ts-ignore Because were removing dispatchers
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
  query<T extends React.ElementType>(
    predicate: Predicate,
    options?: { deep?: boolean },
  ): Element<T>[] {
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
