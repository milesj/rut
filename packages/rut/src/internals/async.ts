type AsyncQueue = Set<Promise<unknown>>;
type Timer = typeof global.setTimeout;

const nativeSetInterval = global.setInterval.bind(global);
const nativeSetTimeout = global.setTimeout.bind(global);
const NativePromise = (global.Promise as unknown) as PromiseConstructor;
const promiseMethodsToWrap: (keyof PromiseConstructor)[] = ['all', 'race', 'resolve', 'reject'];

function createFacadeTimer(timer: Timer, queue: AsyncQueue): Timer {
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

function wrapPromise(queue: AsyncQueue): void {
  function FacadePromise<T>(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: unknown) => void,
    ) => void,
  ): Promise<T> {
    const promise = new NativePromise(executor);

    queue.add(promise);

    return promise;
  }

  promiseMethodsToWrap.forEach(method => {
    Object.defineProperty(FacadePromise, method, {
      value: (...args: unknown[]) => {
        // @ts-ignore
        const promise = NativePromise[method](...args);

        queue.add(promise);

        return promise;
      },
    });
  });

  global.Promise = FacadePromise;
}

function wrapTimers(queue: AsyncQueue): void {
  global.setInterval = createFacadeTimer(nativeSetInterval, queue);
  global.setTimeout = createFacadeTimer(nativeSetTimeout, queue);
}

function unwrapPromise(): void {
  global.Promise = NativePromise;
}

function unwrapTimers(): void {
  global.setInterval = nativeSetInterval;
  global.setTimeout = nativeSetTimeout;
}

export function wrapAndCaptureAsync(): () => Promise<void> {
  const queue: AsyncQueue = new Set();

  wrapPromise(queue);
  wrapTimers(queue);

  return () => {
    unwrapPromise();
    unwrapTimers();

    return NativePromise.all(Array.from(queue)).then(() => {
      return undefined;
    });
  };
}
