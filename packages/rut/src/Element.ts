import { ReactTestInstance } from 'react-test-renderer';
import { Args, UnknownProps, TestNode, FiberNode } from './types';
import { getTypeName } from './helpers';

export default class RutElement<Props = UnknownProps> {
  private node: ReactTestInstance;

  constructor(node: ReactTestInstance) {
    this.node = node;
  }

  children(): (string | RutElement)[] {
    return this.node.children.map(child => {
      if (typeof child === 'string') {
        return child;
      }

      return new RutElement(child);
    });
  }

  emit<K extends keyof Props>(name: K, ...args: Args<Props[K]>): unknown {
    const prop = this.prop(name);

    if (!prop) {
      throw new Error(`${name} does not exist.`);
    } else if (typeof prop !== 'function') {
      throw new TypeError(`${name} is not a function.`);
    }

    return prop(...args);
  }

  find<P = UnknownProps>(type: React.ElementType<P>): RutElement<P>[] {
    return this.node.findAllByType(type).map(node => new RutElement(node));
  }

  findOne<P = UnknownProps>(type: React.ElementType<P>): RutElement<P> {
    const results = this.find(type);

    if (results.length !== 1) {
      throw new Error(
        `Element#findOne: Expected to find 1 result for \`${getTypeName(type)}\`, found ${
          results.length
        }.`,
      );
    }

    return results[0];
  }

  prop<K extends keyof Props>(name: K): Props[K] | undefined {
    return this.node.props[name as string];
  }

  props(): Props {
    return this.node.props as Props;
  }

  query(
    predicate: (node: TestNode, fiber: FiberNode) => boolean,
    options?: { deep?: boolean },
  ): RutElement[] {
    return (
      this.node
        // eslint-disable-next-line no-underscore-dangle
        .findAll(node => predicate(node, node._fiber), { deep: true, ...options })
        .map(node => new RutElement(node))
    );
  }

  type(): React.ElementType {
    return this.node.type;
  }
}
