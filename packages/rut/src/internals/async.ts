import asyncHooks from 'async_hooks';

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

  // Map static properties. We don't need to provide our own
  // since these are all resolved by default for the most part.
  promiseMethodsToWrap.forEach(method => {
    Object.defineProperty(FacadePromise, method, {
      value: NativePromise[method],
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

// Grab all promises in the current queue and clear it.
// Await them until all resolve, but recursively call
// incase promises have been chained or new timers created.
function waitAndResolve(
  queue: Set<Promise<unknown>> | Map<number, Promise<unknown>>,
): Promise<void> {
  const all = Array.from(queue.values());

  if (all.length === 0) {
    return NativePromise.resolve();
  }

  queue.clear();

  return NativePromise.all(all).then(() => waitAndResolve(queue));
}

export function wrapAndCaptureAsync(): () => Promise<void> {
  const queue: AsyncQueue = new Set();

  wrapPromise(queue);
  wrapTimers(queue);

  return () =>
    waitAndResolve(queue).then(() => {
      unwrapPromise();
      unwrapTimers();

      return undefined;
    });
}

// Use `async_hooks` to capture native async calls from Node. This would be the ideal
// solution, but there is so much noise happening from Jest and Node itself, that
// it's very difficult, or maybe impossible, to only capture from the render.
export async function hookAndCaptureAsync(cb: () => Promise<void>): Promise<void> {
  const queue = new Map<number, Promise<unknown>>();
  const resolvers = new Map<number, () => void>();
  const tid = asyncHooks.triggerAsyncId();

  // Hook into promises and timers
  function resolveTimer(id: number) {
    if (resolvers.has(id)) {
      resolvers.get(id)!();
    }
  }

  function removePromise(id: number) {
    if (queue.has(id)) {
      queue.delete(id);
    }
  }

  const hook = asyncHooks
    .createHook({
      before(id) {
        resolveTimer(id);
      },
      destroy(id) {
        resolveTimer(id);
        removePromise(id);
      },
      init(id, type, triggerId, resource: { promise: Promise<unknown> }) {
        if (triggerId !== tid && !queue.has(triggerId)) {
          return;
        }

        switch (type.toLowerCase()) {
          case 'promise':
            queue.set(id, resource.promise);
            break;

          case 'timeout':
          case 'immediate':
            queue.set(
              id,
              new Promise(resolve => {
                resolvers.set(id, resolve);
              }),
            );
            break;

          default:
            break;
        }
      },
    })
    .enable();

  await cb();
  await waitAndResolve(queue);

  // Stop hooking
  hook.disable();

  // Clear lists for GC
  queue.clear();
  resolvers.clear();
}
