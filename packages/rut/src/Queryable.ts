import { ReactTestInstance } from 'react-test-renderer';
import { UnknownProps, TestNode, FiberNode } from './types';
import { getTypeName } from './helpers';
import RutElement from './Element';

export default abstract class Queryable {
  find<P = UnknownProps>(type: React.ElementType<P>): RutElement<P>[] {
    return this.node()
      .findAllByType(type)
      .map(node => new RutElement(node));
  }

  findOne<P = UnknownProps>(type: React.ElementType<P>): RutElement<P> {
    const results = this.find(type);

    if (results.length !== 1) {
      throw new Error(
        `Expected to find 1 element for \`${getTypeName(type)}\`, found ${results.length}.`,
      );
    }

    return results[0];
  }

  query(
    predicate: (node: TestNode, fiber: FiberNode) => boolean,
    options?: { deep?: boolean },
  ): RutElement[] {
    return (
      this.node()
        // eslint-disable-next-line no-underscore-dangle
        .findAll(node => predicate(node, node._fiber), { deep: true, ...options })
        .map(node => new RutElement(node))
    );
  }

  protected abstract node(): ReactTestInstance;
}
