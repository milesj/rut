import { mockEvent, mockSyntheticEvent, BaseEvent, SyntheticEvent } from '../../src/mocks/event';

describe('event', () => {
  describe('mockEvent()', () => {
    it('returns a custom event object', () => {
      const event = mockEvent('click');

      expect(event).toBeInstanceOf(BaseEvent);
    });

    it('sets current target and target via `target`', () => {
      const target = { tag: 'foo' };
      const event = mockEvent('click', { target });

      expect(event.target).toBe(target);
      expect(event.currentTarget).toBe(target);
    });

    it('sets current target via `currentTarget` and target via `target`', () => {
      const target = { tag: 'foo' };
      const currentTarget = { tag: 'bar' };
      const event = mockEvent('click', { currentTarget, target });

      expect(event.target).toBe(target);
      expect(event.currentTarget).toBe(currentTarget);
    });

    it('marks as prevented', () => {
      const event = mockEvent('click');

      event.preventDefault();

      expect(event.defaultPrevented).toBe(true);
    });

    it('marks as stopped', () => {
      const event = mockEvent('click');

      event.stopPropagation();

      expect(event.propagationStopped).toBe(true);
    });

    it('marks as stopped (via immediate)', () => {
      const event = mockEvent('click');

      event.stopImmediatePropagation();

      expect(event.propagationStopped).toBe(true);
    });
  });

  describe('mockSyntheticEvent()', () => {
    it('returns custom event objects', () => {
      const event = mockSyntheticEvent('click');

      expect(event).toBeInstanceOf(SyntheticEvent);
      expect(event.nativeEvent).toBeInstanceOf(BaseEvent);
    });

    it('inherits targets from native event', () => {
      const target = { tag: 'foo' };
      const event = mockSyntheticEvent('click', { target });

      expect(event.target).toBe(event.nativeEvent.target);
    });

    it('marks as persisted', () => {
      const event = mockSyntheticEvent('click');

      event.persist();

      expect(event.isPersistent()).toBe(true);
    });

    it('calls `preventDefault` on both native and synthetic event', () => {
      const event = mockSyntheticEvent('click');
      const spy = jest.spyOn(event.nativeEvent, 'preventDefault');

      event.preventDefault();

      expect(event.isDefaultPrevented()).toBe(true);
      expect(spy).toHaveBeenCalled();
    });

    it('calls `stopPropagation` on both native and synthetic event', () => {
      const event = mockSyntheticEvent('click');
      const spy = jest.spyOn(event.nativeEvent, 'stopPropagation');

      event.stopPropagation();

      expect(event.isPropagationStopped()).toBe(true);
      expect(spy).toHaveBeenCalled();
    });
  });
});
