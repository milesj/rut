import { MatchResult } from '../src/types';

export function runMatcher(result: MatchResult, isNot: boolean = false) {
  if (isNot && result.passed) {
    throw new Error(result.notMessage);
  }

  if (!isNot && !result.passed) {
    throw new Error(result.message);
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
