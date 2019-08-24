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
 * the call site, like so: `findOne('button').emit('onClick`, mockSyntheticEvent('click'))`.
 *
 * With this pattern, mocks are easily typed, and the underlying event object
 * structure is close enough for most, if not all of test cases.
 */

class BaseEvent {
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

export function mockEvent<T = Event>(type: string): T {
  // JSDOM environment does not exist, which means we do not have events.
  // Return a very custom low-level event object for the time being.
  if (typeof window === 'undefined') {
    // @ts-ignore Ignore legacy fields
    return new BaseEvent(type);
  }

  switch (type) {
    case 'animationstart':
    case 'animationend':
    case 'animationiteration':
      // @ts-ignore
      return new AnimationEvent(type);
    case 'blur':
    case 'focus':
      // @ts-ignore
      return new FocusEvent(type);
    case 'copy':
    case 'cut':
    case 'paste':
      // @ts-ignore
      return new ClipboardEvent(type);
    case 'compositionend':
    case 'compositionstart':
    case 'compositionupdate':
      // @ts-ignore
      return new CompositionEvent(type);
    case 'keydown':
    case 'keypress':
    case 'keyup':
      // @ts-ignore
      return new KeyboardEvent(type);
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
      // @ts-ignore
      return new PointerEvent(type);
    case 'touchcancel':
    case 'touchend':
    case 'touchmove':
    case 'touchstart':
      // @ts-ignore
      return new TouchEvent(type);
    case 'transitionend':
      // @ts-ignore
      return new TransitionEvent(type);
    case 'scroll':
      // @ts-ignore
      return new UIEvent(type);
    case 'wheel':
      // @ts-ignore
      return new WheelEvent(type);
    default:
      // @ts-ignore
      return new MouseEvent(type);
  }
}

class SyntheticEvent extends BaseEvent {
  nativeEvent: Event;

  persisted: boolean = false;

  constructor(type: string, nativeEvent: Event) {
    super(type);

    this.nativeEvent = nativeEvent;
    this.bubbles = nativeEvent.bubbles;
    this.cancelable = nativeEvent.cancelable;
    this.defaultPrevented = nativeEvent.defaultPrevented;
    this.eventPhase = nativeEvent.eventPhase;
    this.isTrusted = nativeEvent.isTrusted;
    this.timeStamp = nativeEvent.timeStamp || Date.now();
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

export function mockSyntheticEvent<T = React.SyntheticEvent>(type: string): T {
  // @ts-ignore
  return new SyntheticEvent(type, mockEvent(type));
}
