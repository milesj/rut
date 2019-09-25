import { act } from 'react-test-renderer';
import ExhaustHook from 'exhaust-hook';
import { wrapAndCaptureAsync } from './async';
import { silenceConsoleErrors } from './utils';
import { AsyncMode } from '../types';

type Actable<T> = () => T;

const unfinishedRenders = new Set<Promise<void>>();

export function doAct<T>(cb: Actable<T>): T {
  const restoreConsole = silenceConsoleErrors();
  let value: T;

  try {
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
  } finally {
    restoreConsole();
  }

  return value!;
}

async function wrapAsyncAct<T>(cb: Actable<T>): Promise<T> {
  const waitForQueue = wrapAndCaptureAsync();
  let value: T;

  await act(async () => {
    value = await cb();
  });

  // We need an additional act as async results may cause re-renders
  await act(async () => {
    await waitForQueue();
  });

  return value!;
}

async function hookAsyncAct<T>(cb: Actable<T>): Promise<T> {
  let value!: T;

  await act(async () => {
    await ExhaustHook.run(async () => {
      value = await cb();
    }, 1000);

    await Promise.all([...unfinishedRenders]);
  });

  return value;
}

export async function doAsyncAct<T>(cb: Actable<T>, mode?: AsyncMode): Promise<T> {
  const restoreConsole = silenceConsoleErrors();
  let value: T;

  try {
    value = mode === 'hook' ? await hookAsyncAct(cb) : await wrapAsyncAct(cb);
  } finally {
    restoreConsole();
  }

  return value;
}
