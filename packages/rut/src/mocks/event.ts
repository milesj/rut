/* eslint-disable complexity, max-classes-per-file */

/**
 * In both the `mockEvent` and `mockSyntheticEvent` functions below,
 * you'll notice that every return is being type ignored.
 * We are doing this so that the generic type takes precendence,
 * as we want inferrence to be predominantly used.
 *
 * For example, if a test is emitting `findOne('button').emit('onClick`)`,
 * the first argument is typed as `React.MouseEvent<HTMLButtonElement, MouseEvent>`.
 * We can take advantage of type inferrence by mocking the argument at
 * the call site, like so: `findOne('button').emit('onClick', {}, mockSyntheticEvent('click'))`.
 *
 * With this pattern, mocks are easily typed, and the underlying event object
 * structure is close enough for most, if not all of test cases.
 */

interface EventOptions {
  currentTarget?: HTMLElement;
  target?: Element;
}

export class BaseEvent {
  bubbles: boolean = true;

  cancelable: boolean = true;

  currentTarget: unknown = {};

  defaultPrevented: boolean = false;

  eventPhase: number = 0;

  isTrusted: boolean = true;

  propagationStopped: boolean = false;

  srcElement: null = null;

  target: unknown = {};

  timeStamp: number;

  type: string;

  constructor(type: string) {
    this.timeStamp = Date.now();
    this.type = type;
  }

  preventDefault(): void {
    this.defaultPrevented = true;
  }

  stopImmediatePropagation(): void {
    this.propagationStopped = true;
  }

  stopPropagation(): void {
    this.propagationStopped = true;
  }
}

export function mockEvent<T = Event>(type: string, options: EventOptions = {}): T {
  let event: Event;

  // JSDOM environment does not exist, which means we do not have events.
  // Return a very custom low-level event object for the time being.
  if (typeof window === 'undefined') {
    // @ts-ignore Ignore legacy fields
    event = new BaseEvent(type);

    // https://developer.mozilla.org/en-US/docs/Web/Events
  } else {
    // istanbul ignore next
    switch (type) {
      case 'animationstart':
      case 'animationend':
      case 'animationiteration':
        event = new AnimationEvent(type);
        break;
      case 'blur':
      case 'focus':
        event = new FocusEvent(type);
        break;
      case 'copy':
      case 'cut':
      case 'paste':
        event = new ClipboardEvent(type);
        break;
      case 'compositionend':
      case 'compositionstart':
      case 'compositionupdate':
        event = new CompositionEvent(type);
        break;
      case 'keydown':
      case 'keypress':
      case 'keyup':
        event = new KeyboardEvent(type);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerenter':
      case 'pointerleave':
      case 'pointerover':
      case 'pointermove':
      case 'pointerout':
      case 'pointerup':
        event = new PointerEvent(type);
        break;
      case 'touchcancel':
      case 'touchend':
      case 'touchmove':
      case 'touchstart':
        event = new TouchEvent(type);
        break;
      case 'transitionend':
        event = new TransitionEvent(type);
        break;
      case 'scroll':
        event = new UIEvent(type);
        break;
      case 'wheel':
        event = new WheelEvent(type);
        break;
      default:
        event = new MouseEvent(type);
        break;
    }
  }

  if (options.target) {
    Object.defineProperty(event, 'target', {
      value: options.target,
    });
  }

  if (options.currentTarget || options.target) {
    Object.defineProperty(event, 'currentTarget', {
      value: options.currentTarget || options.target,
    });
  }

  // @ts-ignore
  return event;
}

export class SyntheticEvent extends BaseEvent {
  nativeEvent: Event;

  persisted: boolean = false;

  constructor(type: string, nativeEvent: Event) {
    super(type);

    this.nativeEvent = nativeEvent;
    this.bubbles = nativeEvent.bubbles;
    this.cancelable = nativeEvent.cancelable;
    this.currentTarget = nativeEvent.currentTarget;
    this.defaultPrevented = nativeEvent.defaultPrevented;
    this.eventPhase = nativeEvent.eventPhase;
    this.isTrusted = nativeEvent.isTrusted;
    this.target = nativeEvent.target;
    this.timeStamp = nativeEvent.timeStamp;
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

export function mockSyntheticEvent<T = React.SyntheticEvent>(
  type: string,
  options: EventOptions = {},
): T {
  // @ts-ignore
  return new SyntheticEvent(type, mockEvent(type, options));
}
