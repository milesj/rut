/* eslint-disable lines-between-class-members, no-dupe-class-members */

import React from 'react';
import { act, ReactTestInstance } from 'react-test-renderer';
import { ArgsOf, ReturnOf, TestNode, FiberNode, HostComponentType } from './types';
import { getTypeName } from './helpers';

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
   * Find and execute an event handler (a function prop for the defined name).
   * Accepts a list of arguments, and returns the result of the execution.
   *
   * Note: This may only be executed on host components (HTML elements).
   */
  emit<K extends keyof Props>(name: K, ...args: ArgsOf<Props[K]>): ReturnOf<Props[K]> {
    const prop = this.prop(name);

    if (!prop) {
      throw new Error(`Prop \`${name}\` does not exist.`);
    } else if (typeof prop !== 'function') {
      throw new TypeError(`Prop \`${name}\` is not a function.`);
    } else if (typeof this.type() !== 'string') {
      throw new TypeError('Emitting events is only allowed on host components (HTML elements).');
    }

    let value: ReturnOf<Props[K]>;

    act(() => {
      value = prop(...args);
    });

    // @ts-ignore Is assigned
    return value;
  }

  /**
   * Search through the current tree for all elements that match the defined React
   * component or HTML type. If any are found, a list of `Element`s is returned.
   */
  find<T extends HostComponentType>(type: T): Element<JSX.IntrinsicElements[T]>[];
  find<P>(type: React.ComponentType<P>): Element<P>[];
  find(type: React.ElementType<unknown>): Element<unknown>[] {
    return this.element.findAllByType(type).map(node => new Element(node));
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
    return getTypeName(this.element._fiber.elementType || this.element._fiber.type);
  }

  /**
   * Return the value of a prop by name, or undefined if not found.
   */
  prop<K extends keyof Props>(name: K): Props[K] | undefined {
    return this.element.props[name as string];
  }

  /**
   * Return an object of all props on the current element.
   */
  props(): Props {
    return this.element.props as Props;
  }

  /**
   * Search through the current child tree using a custom predicate, which is passed the
   * React TestRenderer node and internal React fiber node. If any are found,
   * a list of `Element`s is returned.
   */
  query<P = {}>(
    predicate: (node: TestNode, fiber: FiberNode) => boolean,
    options?: { deep?: boolean },
  ): Element<P>[] {
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

  /**
   * Return the React element type.
   */
  type(): React.ElementType {
    return this.element.type;
  }
}
