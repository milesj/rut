import { MatchResult } from '../src/types';

export function runMatcher(result: MatchResult, isNot: boolean = false) {
  if (isNot && result.passed) {
    throw new Error(result.notMessage);
  }

  if (!isNot && !result.passed) {
    throw new Error(result.message);
  }
}
