/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style */

import type { ReactTestInstance } from 'react-test-renderer';
import { doRender, doRenderAndWait } from '../adapters';
import SyntheticEvent from '../SyntheticEvent';
import RutElement from '../Element';
import SyncResult from '../SyncResult';
import AsyncResult from '../AsyncResult';
import { MatchResult, RendererOptions } from '../types';

export interface RenderTestSuite {
  Element: Function & { prototype: RutElement<any, any, any> };

  mockSyntheticEvent<T>(type: string, options?: unknown): T;

  render<P extends object>(
    element: React.ReactElement<P>,
    options?: RendererOptions,
  ): SyncResult<P, RutElement<any, P>>;

  renderAndWait<P extends object>(
    element: React.ReactElement<P>,
    options?: RendererOptions,
  ): Promise<AsyncResult<P, RutElement<any, P>>>;
}

export function mockSyntheticEvent<T>(type: string): T {
  // @ts-expect-error
  return new SyntheticEvent(type, {
    preventDefault() {},
    stopPropagation() {},
  });
}

export class TestElement extends RutElement {
  createSyntheticEvent(type: string, event: unknown) {
    if (event instanceof SyntheticEvent) {
      return event;
    }

    return mockSyntheticEvent(type) as React.SyntheticEvent;
  }
}

function applyPatches() {
  return () => () => {};
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
    applyPatches,
    createElement,
  });
}

export function renderAndWait<Props extends object = {}>(
  element: React.ReactElement,
  options?: RendererOptions,
) {
  return doRenderAndWait<Props, TestElement>(element, {
    ...options,
    applyPatches,
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
  return new Promise((resolve) => {
    done();
    resolve();
  });
}
