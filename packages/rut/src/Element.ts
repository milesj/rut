import { ReactTestInstance, act } from 'react-test-renderer';
import { Args, UnknownProps, TestNode, FiberNode } from './types';
import { getTypeName } from './helpers';

export default class Element<Props = UnknownProps> {
  private element: ReactTestInstance;

  constructor(element: ReactTestInstance) {
    this.element = element;
  }

  children(): (string | Element)[] {
    return this.element.children.map(child => {
      if (typeof child === 'string') {
        return child;
      }

      return new Element(child);
    });
  }

  emit<K extends keyof Props>(name: K, ...args: Args<Props[K]>): unknown {
    const prop = this.prop(name);

    if (!prop) {
      throw new Error(`${name} does not exist.`);
    } else if (typeof prop !== 'function') {
      throw new TypeError(`${name} is not a function.`);
    }

    let value;

    act(() => {
      value = prop(...args);
    });

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
