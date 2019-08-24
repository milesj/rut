/* eslint-disable complexity, max-classes-per-file */

class DOMEvent {
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

class SyntheticEvent extends DOMEvent {
  nativeEvent: Event;

  persisted: boolean = false;

  constructor(nativeEvent: Event) {
    super('event');

    this.nativeEvent = nativeEvent;
    this.bubbles = nativeEvent.bubbles;
    this.cancelable = nativeEvent.cancelable;
    this.defaultPrevented = nativeEvent.defaultPrevented;
    this.eventPhase = nativeEvent.eventPhase;
    this.isTrusted = nativeEvent.isTrusted;
    this.timeStamp = nativeEvent.timeStamp || Date.now();
    this.type = nativeEvent.type;
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

function createNativeEvent(type: string): Event {
  // JSDOM environment does not exist, which means we do not have events.
  // Return a very custom low-level event for the time being.
  if (typeof window === 'undefined') {
    // @ts-ignore Ignore legacy fields
    return new DOMEvent(type);
  }

  switch (type) {
    case 'copy':
    case 'cut':
    case 'paste':
      return new ClipboardEvent(type);
    case 'compositionend':
    case 'compositionstart':
    case 'compositionupdate':
      return new CompositionEvent(type);
    case 'keydown':
    case 'keypress':
    case 'keyup':
      return new KeyboardEvent(type);
    case 'blur':
    case 'focus':
      return new FocusEvent(type);
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
      return new PointerEvent(type);
    case 'touchcancel':
    case 'touchend':
    case 'touchmove':
    case 'touchstart':
      return new TouchEvent(type);
    case 'scroll':
      return new UIEvent(type);
    case 'wheel':
      return new WheelEvent(type);
    case 'animationstart':
    case 'animationend':
    case 'animationiteration':
      return new AnimationEvent(type);
    case 'transitionend':
      return new TransitionEvent(type);
    default:
      return new MouseEvent(type);
  }
}

export default function mockSyntheticEvent<T = React.SyntheticEvent>(type: string): T {
  // I'm aware this type might not resolve to `T`,
  // but usually that `T` points to something like `React.MouseEvent`,
  // which we want to be inferred and typed automatically.
  // @ts-ignore
  return new SyntheticEvent(createNativeEvent(type));
}
