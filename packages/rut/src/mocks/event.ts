/* eslint-disable complexity, max-classes-per-file */

/**
 * In both the `mockEvent` and `mockSyntheticEvent` functions below,
 * you'll notice that every return is being type ignored.
 * We are doing this so that the generic type takes precendence,
 * as we want inferrence to be predominantly used.
 *
 * For example, if a test is emitting `findOne('button').emit('click`)`,
 * the first argument is typed as `React.MouseEvent<HTMLButtonElement, MouseEvent>`.
 * We can take advantage of type inferrence by mocking the argument at
 * the call site, like so: `findOne('button').emit('click', {}, mockSyntheticEvent('click'))`.
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

// https://developer.mozilla.org/en-US/docs/Web/Events
// istanbul ignore next
function createHostEvent(type: string): Event {
  switch (type) {
    case 'animationcancel':
    case 'animationiteration':
    case 'animationend':
    case 'animationstart':
      return new AnimationEvent(type);
    case 'beforeunload':
      return new BeforeUnloadEvent();
    case 'auxclick':
    case 'click':
    case 'contextmenu':
    case 'dblclick':
    case 'mousedown':
    case 'mouseenter':
    case 'mouseleave':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'mouseup':
      return new MouseEvent(type);
    case 'devicelight':
    case 'devicemotion':
    case 'deviceorientation':
    case 'deviceorientationabsolute':
      return new DeviceLightEvent(type);
    case 'blur':
    case 'focus':
      return new FocusEvent(type);
    case 'copy':
    case 'cut':
    case 'paste':
      return new ClipboardEvent(type);
    case 'compositionend':
    case 'compositionstart':
    case 'compositionupdate':
      return new CompositionEvent(type);
    case 'drag':
    case 'dragend':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'dragstart':
    case 'drop':
      return new DragEvent(type);
    case 'error':
      return new ErrorEvent(type);
    case 'hashchange':
      return new HashChangeEvent(type);
    case 'keydown':
    case 'keypress':
    case 'keyup':
      return new KeyboardEvent(type);
    case 'loadend':
    case 'progress':
    case 'readystatechange':
      return new ProgressEvent(type);
    case 'message':
    case 'messageerror':
      return new MessageEvent(type);
    case 'pagehide':
    case 'pageshow':
      return new PageTransitionEvent();
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
    case 'popstate':
      return new PopStateEvent(type);
    case 'touchcancel':
    case 'touchend':
    case 'touchmove':
    case 'touchstart':
      return new TouchEvent(type);
    case 'transitioncancel':
    case 'transitionend':
    case 'transitionrun':
    case 'transitionstart':
      return new TransitionEvent(type);
    case 'abort':
    case 'scroll':
    case 'resize':
      return new UIEvent(type);
    case 'securitypolicyviolation':
      return new SecurityPolicyViolationEvent(type);
    case 'storage':
      return new StorageEvent(type);
    case 'unhandledrejection':
      return new PromiseRejectionEvent(type, { promise: Promise.resolve() });
    case 'wheel':
      return new WheelEvent(type);
    default:
      return new Event(type);
  }
}

export function mockEvent<T = Event>(type: string, options: EventOptions = {}): T {
  let event: Event;

  // JSDOM environment does not exist, which means we do not have events.
  // Return a very custom low-level event object for the time being.
  if (typeof window === 'undefined') {
    // @ts-ignore Ignore legacy fields
    event = new BaseEvent(type);
  } else {
    event = createHostEvent(type);
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
