import { ReactTestInstance } from 'react-test-renderer';
import { Args, UnknownProps } from './types';
import Queryable from './Queryable';

export default class Element<Props = UnknownProps> extends Queryable {
  private element: ReactTestInstance;

  constructor(element: ReactTestInstance) {
    super();

    this.element = element;
  }

  children(): (string | Element)[] {
    return this.testInstance().children.map(child => {
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

    return prop(...args);
  }

  prop<K extends keyof Props>(name: K): Props[K] | undefined {
    return this.testInstance().props[name as string];
  }

  props(): Props {
    return this.testInstance().props as Props;
  }

  type(): React.ElementType {
    return this.testInstance().type;
  }

  protected testInstance() {
    return this.element;
  }
}