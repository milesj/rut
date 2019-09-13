import { SyntheticEvent, mockSyntheticEvent } from '../mocks/event';
import { EventType, EventOptions } from '../types';

export function createEvent(
  eventType: EventType,
  event: unknown,
  elementType: React.ElementType,
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
