import { SyntheticEvent, mockSyntheticEvent } from '../mocks/event';
import { EventType } from '../types';

// TODO
export function createEvent(type: EventType, event: unknown): React.SyntheticEvent {
  // @ts-ignore
  return event instanceof SyntheticEvent ? event : mockSyntheticEvent(type);
}
