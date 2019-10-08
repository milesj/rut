import { act } from 'react-test-renderer';
import { integrationOptions } from '../configure';
import { patchConsoleErrors, patchReactDOM } from './patch';

type Actable<T> = () => T;

export function doAct<T>(cb: Actable<T>): T {
  const restoreConsole = patchConsoleErrors();
  const restoreReactDOM = patchReactDOM();
  let value: T;

  try {
    act(() => {
      value = integrationOptions.runWithTimers(cb);
    });
  } finally {
    restoreConsole();
    restoreReactDOM();
  }

  return value!;
}

export async function doAsyncAct<T>(cb: Actable<T>): Promise<T> {
  const restoreConsole = patchConsoleErrors();
  const restoreReactDOM = patchReactDOM();
  let value: T;

  try {
    await act(async () => {
      value = await integrationOptions.runWithTimers(cb);
    });
  } finally {
    restoreConsole();
    restoreReactDOM();
  }

  return value!;
}
