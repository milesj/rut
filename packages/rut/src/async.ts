/* eslint-disable @typescript-eslint/no-explicit-any */

export type AsyncQueue = Set<Promise<any>>;

export type DelayedTimer = (
  callback: (...args: any[]) => void,
  delay: number,
  ...args: any[]
) => NodeJS.Timeout;

export type ScheduledTimer = (callback: (value: any) => void, ...args: any[]) => number;

declare global {
  interface Window {
    requestIdleCallback: ScheduledTimer;
  }
}

function findAndPreserveNative<T>(name: string, bind: boolean = true): T {
  let func = () => {};

  if (typeof global !== 'undefined' && name in global) {
    func = (global as any)[name];

    if (bind) {
      func = func.bind(global);
    }
  } else if (typeof window !== 'undefined' && name in window) {
    func = (window as any)[name];

    if (bind) {
      func = func.bind(window);
    }
  }

  // @ts-ignore
  return func;
}

const nativeRequestAnimationFrame = findAndPreserveNative<ScheduledTimer>('requestAnimationFrame');
const nativeRequestIdleCallback = findAndPreserveNative<ScheduledTimer>('requestIdleCallback');
const nativeSetInterval = findAndPreserveNative<DelayedTimer>('setInterval');
const nativeSetTimeout = findAndPreserveNative<DelayedTimer>('setTimeout');
const NativePromise = findAndPreserveNative<PromiseConstructor>('Promise', false);

export function createFakeDelayedTimer(timer: DelayedTimer, queue: AsyncQueue): DelayedTimer {
  return (callback, ms, ...args) => {
    let resolver: () => void;

    queue.add(
      new Promise(resolve => {
        resolver = resolve;
      }),
    );

    return timer(() => {
      resolver();
      callback(...args);
    }, ms);
  };
}

export function createFakeScheduledTimer(timer: ScheduledTimer, queue: AsyncQueue): ScheduledTimer {
  return (callback, ...args) => {
    let resolver: () => void;

    queue.add(
      new Promise(resolve => {
        resolver = resolve;
      }),
    );

    return timer(value => {
      resolver();
      callback(value);
    }, ...args);
  };
}

const promiseMethodsToWrap: (keyof PromiseConstructor)[] = ['all', 'race', 'resolve', 'reject'];

export function wrapPromise(queue: AsyncQueue) {
  function FakePromise<T>(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ): Promise<T> {
    const promise = new NativePromise(executor);

    queue.add(promise);

    return promise;
  }

  promiseMethodsToWrap.forEach(method => {
    Object.defineProperty(FakePromise, method, {
      value: (...args: unknown[]) => {
        // @ts-ignore
        const promise = NativePromise[method](...args);

        queue.add(promise);

        return promise;
      },
    });
  });

  global.Promise = FakePromise;
}

export function wrapTimers(queue: AsyncQueue) {
  if (typeof window !== 'undefined') {
    window.requestAnimationFrame = createFakeScheduledTimer(nativeRequestAnimationFrame, queue);
    window.requestIdleCallback = createFakeScheduledTimer(nativeRequestIdleCallback, queue);
  }

  global.setInterval = createFakeDelayedTimer(nativeSetInterval, queue);
  global.setTimeout = createFakeDelayedTimer(nativeSetTimeout, queue);
}

export function wrapAndCaptureAsync(): AsyncQueue {
  const queue: AsyncQueue = new Set();

  wrapPromise(queue);
  wrapTimers(queue);

  return queue;
}

export function unwrapPromise() {
  global.Promise = NativePromise;
}

export function unwrapTimers() {
  if (typeof window !== 'undefined') {
    window.requestAnimationFrame = nativeRequestAnimationFrame;
    window.requestIdleCallback = nativeRequestIdleCallback;
  }

  global.setInterval = nativeSetInterval;
  global.setTimeout = nativeSetTimeout;
}

export function waitForAsyncQueue(queue: AsyncQueue) {
  unwrapPromise();
  unwrapTimers();

  return NativePromise.all(Array.from(queue));
}
