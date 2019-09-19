import { act } from 'react-test-renderer';
import ExhaustHook from 'exhaust-hook';

type Actable<T> = () => T;

const unfinishedRenders = new Set<Promise<void>>();

export function doAct<T>(cb: Actable<T>): T {
  let value: T;

  act(() => {
    const promise = new Promise<void>(resolve => {
      ExhaustHook.runSync(() => {
        value = cb();
      }, 1000)
        .finally(() => {
          unfinishedRenders.delete(promise);
          resolve();
        })
        .catch(() => {});
    });

    unfinishedRenders.add(promise);
  });

  return value!;
}

export async function doAsyncAct<T>(cb: Actable<T>): Promise<T> {
  let value!: T;

  await act(async () => {
    await ExhaustHook.run(async () => {
      value = await cb();
    }, 1000);

    await Promise.all([...unfinishedRenders]);
  });

  return value;
}
