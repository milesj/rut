import { act } from 'react-test-renderer';
import { integrationOptions } from '../configure';
import { silenceConsoleErrors } from './utils';

type Actable<T> = () => T;

export function doAct<T>(cb: Actable<T>): T {
  const restoreConsole = silenceConsoleErrors();
  let value: T;

  try {
    act(() => {
      value = integrationOptions.runWithTimers(cb);
    });
  } finally {
    restoreConsole();
  }

  return value!;
}

export async function doAsyncAct<T>(cb: Actable<T>): Promise<T> {
  const restoreConsole = silenceConsoleErrors();
  let value: T;

  try {
    await act(async () => {
      value = await integrationOptions.runWithTimers(cb);
    });
  } finally {
    restoreConsole();
  }

  return value!;
}
