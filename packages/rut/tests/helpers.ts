import { MatchResult } from '../src/types';

export function formatMatcherMessage(result: MatchResult, isNot: boolean) {
  return (isNot ? result.notMessage : result.message)
    .replace('{{received}}', `\`${String(result.received)}\``)
    .replace('{{expected}}', String(result.expected))
    .replace('{{actual}}', String(result.actual));
}

export function runMatcher(result: MatchResult, isNot: boolean = false) {
  const passed = typeof result.passed === 'function' ? result.passed() : result.passed;

  if (isNot && passed) {
    throw new Error(formatMatcherMessage(result, isNot));
  }

  if (!isNot && !passed) {
    throw new Error(formatMatcherMessage(result, isNot));
  }
}

export function runAsyncCall(done: () => void) {
  return new Promise(resolve => {
    setTimeout(() => {
      done();
      resolve();
    }, 50);
  });
}
