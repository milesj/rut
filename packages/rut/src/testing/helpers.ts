import { ReactTestInstance } from 'react-test-renderer';
import { doRender, doRenderAndWait, Element, SyntheticEvent } from '../adapters';
import { MatchResult, RendererOptions } from '../types';

class TestElement extends Element {
  createSyntheticEvent(type: string) {
    // @ts-ignore
    return new SyntheticEvent(type, {
      preventDefault() {},
      stopPropagation() {},
    });
  }
}

function createElement(instance: ReactTestInstance) {
  return new TestElement(instance);
}

export function render<Props extends object = {}>(
  element: React.ReactElement,
  options?: RendererOptions,
) {
  return doRender<Props, TestElement>(element, {
    ...options,
    createElement,
  });
}

export function renderAndWait<Props extends object = {}>(
  element: React.ReactElement,
  options?: RendererOptions,
) {
  return doRenderAndWait<Props, TestElement>(element, {
    ...options,
    createElement,
  });
}

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
