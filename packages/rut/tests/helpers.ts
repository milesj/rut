import { createAdapter, Element, SyntheticEvent } from '../src/adapters';
import { MatchResult } from '../src/types';

class TestElement extends Element {
  createSyntheticEvent(type: string) {
    // @ts-ignore
    return new SyntheticEvent(type, {
      preventDefault() {},
      stopPropagation() {},
    });
  }
}

export const { render, renderAndWait } = createAdapter(instance => new TestElement(instance));

export function formatMatcherMessage(result: MatchResult, isNot: boolean) {
  return (isNot ? result.notMessage : result.message)
    .replace('{{received}}', String(result.received))
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
    done();
    resolve();
  });
}
