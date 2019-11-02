// https://developer.mozilla.org/en-US/docs/Web/Events
// istanbul ignore next
export function createEvent(type: string): Event {
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
