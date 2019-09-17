import { act } from 'react-test-renderer';
import { hookAndCaptureAsync } from './async';

type Actable<T> = () => T;

export function doAct<T>(cb: Actable<T>): T {
  let value: T;

  act(() => {
    value = cb();
  });

  return value!;
}

export async function doAsyncAct<T>(cb: Actable<T>): Promise<T> {
  // const waitForQueue = wrapAndCaptureAsync();
  let value: T;

  await act(async () => {
    await hookAndCaptureAsync(() => {
      value = cb();
    });
  });

  // // We need an additional act as async results may cause re-renders
  // await act(async () => {
  //   await waitForQueue();
  // });

  return value!;
}
