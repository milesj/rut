import { ReactTestInstance, act } from 'react-test-renderer';
import { ArgsOf, ReturnOf, UnknownProps, TestNode, FiberNode } from './types';
import { getTypeName } from './helpers';

export default class Element<Props = UnknownProps> {
  readonly isRutElement = true;

  private element: ReactTestInstance;

  constructor(element: ReactTestInstance) {
    this.element = element;
  }

  /**
   * Return all children as a list of strings and `Element`s.
   */
  children(): (string | Element)[] {
    return this.element.children.map(child => {
      if (typeof child === 'string') {
        return child;
      }

      return new Element(child);
    });
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
   * Search through the current children tree for all elements that match the defined React
   * element type. If any are found, a list of `Element`s is returned.
   */
  find<P = UnknownProps>(type: React.ElementType<P>): Element<P>[] {
    return this.element.findAllByType(type).map(node => new Element(node));
  }

  /**
   * Search through the current children tree for a single element that matches the defined React
   * element type. If exactly 1 is found, a `Element`s is returned, otherwise an error
   * is thrown.
   */
  findOne<P = UnknownProps>(type: React.ElementType<P>): Element<P> {
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

  prop<K extends keyof Props>(name: K): Props[K] | undefined {
    return this.element.props[name as string];
  }

  props(): Props {
    return this.element.props as Props;
  }

  /**
   * Search through the current children tree using a custom predicate, which is passed the
   * React TestRenderer node and internal React fiber node. If any are found,
   * a list of `Element`s is returned.
   */
  query<P = UnknownProps>(
    predicate: (node: TestNode, fiber: FiberNode) => boolean,
    options?: { deep?: boolean },
  ): Element<P>[] {
    return this.element
      .findAll(node => predicate(node, node._fiber), { deep: true, ...options })
      .map(node => new Element(node));
  }

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

  type(): React.ElementType {
    return this.element.type;
  }
}
