import React from 'react';
import { EventType, EventOptions, InferHostElementFromEvent } from '../types';
import { BaseEvent, SyntheticEvent, createHostEvent } from '../internals/event';

/**
 * In both the `mockEvent` and `mockSyntheticEvent` functions below,
 * you'll notice that every return is being type ignored.
 * We are doing this so that the generic type takes precendence,
 * as we want inferrence to be predominantly used.
 *
 * For example, if a test is dispatching `findOne('button').dispatch('onClick`)`,
 * the first argument is typed as `React.MouseEvent<HTMLButtonElement, MouseEvent>`.
 * We can take advantage of type inferrence by mocking the argument at
 * the call site, like so: `findOne('button').dispatch('onClick', mockSyntheticEvent('onClick'))`.
 *
 * With this pattern, mocks are easily typed, and the underlying event object
 * structure is close enough for most, if not all of test cases.
 */

/**
 * Mock a DOM `Event` based on type.
 */
export function mockEvent<T = Event>(type: string, options?: EventOptions<Element, T>): T {
  const { currentTarget, target, ...props } = options || {};
  let event: Event;

  // JSDOM environment does not exist, which means we do not have events.
  // Return a very custom low-level event object for the time being.
  if (typeof window === 'undefined') {
    // @ts-ignore Ignore legacy fields
    event = new BaseEvent(type);
  } else {
    event = createHostEvent(type);
  }

  if (target) {
    Object.defineProperty(event, 'target', {
      enumerable: true,
      value: target,
    });
  }

  if (currentTarget || target) {
    Object.defineProperty(event, 'currentTarget', {
      enumerable: true,
      value: currentTarget || target,
    });
  }

  Object.entries(props).forEach(([prop, value]) => {
    Object.defineProperty(event, prop, {
      enumerable: true,
      value,
    });
  });

  // @ts-ignore
  return event;
}

/**
 * Mock a React `SyntheticEvent` based on type.
 */
export function mockSyntheticEvent<T = React.SyntheticEvent>(
  type: EventType,
  options?: EventOptions<InferHostElementFromEvent<T>, T>,
): T {
  let eventType = type.toLowerCase();

  if (eventType.startsWith('on')) {
    eventType = eventType.slice(2);
  }

  // @ts-ignore
  return new SyntheticEvent(eventType, mockEvent(eventType, options));
}

/**
 * Factory a synthetic event from an an event directly, or with an options object.
 */
export function factorySyntheticEvent(
  eventType: EventType,
  event?: unknown,
  elementType?: React.ElementType,
): React.SyntheticEvent {
  // Event provided by consumer, so use as is
  if (event instanceof SyntheticEvent) {
    return event as React.SyntheticEvent;
  }

  // Either event options or nothing provided
  const options: EventOptions<Element, Event> =
    typeof event === 'object' && event !== null ? event : {};

  // Set a target automatically if not provided
  if (typeof elementType === 'string' && !options.target) {
    if (typeof document === 'undefined') {
      options.target = { tagName: elementType.toUpperCase() };
    } else {
      options.target = document.createElement(elementType);
    }
  }

  return mockSyntheticEvent(eventType, options);
}
