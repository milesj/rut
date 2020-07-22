import BaseEvent from './BaseEvent';

interface EventLike {
  preventDefault: () => void;
  stopPropagation: () => void;
}

export default class SyntheticEvent<E extends EventLike = Event, T = unknown> extends BaseEvent<T> {
  nativeEvent: E;

  persisted: boolean = false;

  constructor(type: string, nativeEvent: E) {
    super(type);

    this.nativeEvent = nativeEvent;

    // Copy over non-function properties
    Object.entries(nativeEvent).forEach(([key, value]) => {
      if (typeof value !== 'function') {
        Object.defineProperty(this, key, {
          enumerable: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          value,
        });
      }
    });
  }

  isDefaultPrevented(): boolean {
    return this.defaultPrevented;
  }

  isPersistent(): boolean {
    return this.persisted;
  }

  isPropagationStopped(): boolean {
    return this.propagationStopped;
  }

  persist(): void {
    this.persisted = true;
  }

  preventDefault(): void {
    this.nativeEvent.preventDefault();
    this.defaultPrevented = true;
  }

  stopPropagation(): void {
    this.nativeEvent.stopPropagation();
    this.propagationStopped = true;
  }
}
