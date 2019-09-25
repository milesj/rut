import { act } from 'react-test-renderer';
import { wrapAndCaptureAsync } from './async';
import { silenceConsoleErrors } from './utils';

type Actable<T> = () => T;

export function doAct<T>(cb: Actable<T>): T {
  const restoreConsole = silenceConsoleErrors();
  let value: T;

  try {
    act(() => {
      value = cb();
    });
  } finally {
    restoreConsole();
  }

  return value!;
}

export async function doAsyncAct<T>(cb: Actable<T>): Promise<T> {
  const waitForQueue = wrapAndCaptureAsync();
  const restoreConsole = silenceConsoleErrors();
  let value: T;

  try {
    await act(async () => {
      value = await cb();
    });

    // We need an additional act as async results may cause re-renders
    await act(async () => {
      await waitForQueue();
    });
  } finally {
    restoreConsole();
  }

  return value!;
}
