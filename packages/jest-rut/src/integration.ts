// Relying on fake timers instead of real timers gives us full control
// of the rendering cycle. For example, we can simply exhaust all timers
// created within the callback and return immediately.
export function runWithTimers<T>(cb: () => T): T {
  const isFakeTimers = '_isMockFunction' in global.setTimeout;

  if (!isFakeTimers) {
    jest.useFakeTimers();
  }

  const value = cb();
  let loop = 0;

  while (jest.getTimerCount() > 0 && loop < 10) {
    jest.runAllImmediates();
    jest.runAllTicks();
    jest.runAllTimers();
    loop += 1;
  }

  if (!isFakeTimers) {
    jest.useRealTimers();
  }

  return value;
}
