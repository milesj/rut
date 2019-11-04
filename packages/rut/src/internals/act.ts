import { act } from 'react-test-renderer';
import { integrationOptions } from './config';
import { patchConsoleErrors } from './patch';

type Actable<T> = () => T;
type Patcher = () => () => void;

export function doAct<T>(cb: Actable<T>, patchAdapter: Patcher): T {
  const restoreConsole = patchConsoleErrors();
  const restoreAdapter = patchAdapter();
  let value: T;

  try {
    act(() => {
      value = integrationOptions.runWithTimers(cb);
    });
  } finally {
    restoreConsole();
    restoreAdapter();
  }

  return value!;
}

export async function doAsyncAct<T>(cb: Actable<T>, patchAdapter: Patcher): Promise<T> {
  const restoreConsole = patchConsoleErrors();
  const restoreAdapter = patchAdapter();
  let value: T;

  try {
    await act(async () => {
      value = await integrationOptions.runWithTimers(cb);
    });
  } finally {
    restoreConsole();
    restoreAdapter();
  }

  return value!;
}
