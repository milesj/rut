/* eslint-disable @typescript-eslint/no-explicit-any */

const NativePromise = (global.Promise as any) as PromiseConstructor;
const methodsToWrap: (keyof PromiseConstructor)[] = ['all', 'race', 'resolve', 'reject'];

export function wrapAndCaptureAsync(): Promise<any>[] {
  const queue: Promise<any>[] = [];

  function MockPromise<T>(
    executor: (
      resolve: (value?: T | PromiseLike<T>) => void,
      reject: (reason?: any) => void,
    ) => void,
  ): Promise<T> {
    const promise = new NativePromise(executor);

    queue.push(promise);

    return promise;
  }

  methodsToWrap.forEach(method => {
    Object.defineProperty(MockPromise, method, {
      value: (...args: unknown[]) => {
        // @ts-ignore
        const promise = NativePromise[method](...args);

        queue.push(promise);

        return promise;
      },
    });
  });

  global.Promise = MockPromise;

  return queue;
}

export function unwrapPromise() {
  global.Promise = NativePromise;
}

export function waitForAsyncQueue(queue: Promise<any>[]) {
  unwrapPromise();

  return NativePromise.all(queue);
}
