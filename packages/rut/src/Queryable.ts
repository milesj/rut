import { ReactTestInstance } from 'react-test-renderer';
import Element from './Element';
import { UnknownProps, TestNode, FiberNode } from './types';
import { getElementTypeName } from './helpers';

export default abstract class Queryable {
  /**
   * Search through the current children tree for all elements that match the defined React
   * element type. If any are found, a list of `Element`s is returned.
   */
  find<P = UnknownProps>(type: React.ElementType<P>): Element<P>[] {
    return this.testInstance()
      .findAllByType(type)
      .map(node => new Element(node));
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
        `Expected to find 1 element for \`${getElementTypeName(type)}\`, found ${results.length}.`,
      );
    }

    return results[0];
  }

  /**
   * Search through the current children tree using a custom predicate, which is passed the
   * React TestRenderer node and internal React fiber node. If any are found,
   * a list of `Element`s is returned.
   */
  query(
    predicate: (node: TestNode, fiber: FiberNode) => boolean,
    options?: { deep?: boolean },
  ): Element[] {
    return (
      this.testInstance()
        // eslint-disable-next-line no-underscore-dangle
        .findAll(node => predicate(node, node._fiber), { deep: true, ...options })
        .map(node => new Element(node))
    );
  }

  /**
   * Return the name of the component or element. Will use `displayName` if defined.
   */
  toString(): string {
    return getElementTypeName(this.testInstance().type);
  }

  protected abstract testInstance(): ReactTestInstance;
}
