import { ReactTestInstance } from 'react-test-renderer';
import { Args, UnknownProps } from './types';
import Queryable from './Queryable';

export default class RutElement<Props = UnknownProps> extends Queryable {
  private element: ReactTestInstance;

  constructor(element: ReactTestInstance) {
    super();

    this.element = element;
  }

  children(): (string | RutElement)[] {
    return this.node().children.map(child => {
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

  prop<K extends keyof Props>(name: K): Props[K] | undefined {
    return this.node().props[name as string];
  }

  props(): Props {
    return this.node().props as Props;
  }

  type(): React.ElementType {
    return this.node().type;
  }

  protected node() {
    return this.element;
  }
}
