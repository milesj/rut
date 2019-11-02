import { SyntheticEvent } from '../../src/internals/event';
import { mockEvent, mockSyntheticEvent, factorySyntheticEvent } from '../../src/mocks/event';
import { FuncComp } from '../fixtures';

describe('event', () => {
  describe('mockEvent()', () => {
    it('returns a custom event object', () => {
      const event = mockEvent('click');

      expect(event.constructor.name).toBe('BaseEvent');
      expect(event.type).toBe('click');
    });

    it('sets current target and target via `target`', () => {
      const target = { tagName: 'foo' };
      const event = mockEvent('click', { target });

      expect(event.target).toBe(target);
      expect(event.currentTarget).toBe(target);
    });

    it('sets current target via `currentTarget` and target via `target`', () => {
      const target = { tagName: 'foo' };
      const currentTarget = { tagName: 'bar' };
      const event = mockEvent('click', { currentTarget, target });

      expect(event.target).toBe(target);
      expect(event.currentTarget).toBe(currentTarget);
    });

    it('sets additional options based on type of event', () => {
      const event = mockEvent<KeyboardEvent>('keydown', {
        ctrlKey: true,
        metaKey: true,
        key: 'Esc',
      });

      expect(event.ctrlKey).toBe(true);
      expect(event.metaKey).toBe(true);
      expect(event.key).toBe('Esc');
    });

    it('marks as prevented', () => {
      const event = mockEvent('click');

      event.preventDefault();

      expect(event.defaultPrevented).toBe(true);
    });

    it('marks as stopped', () => {
      const event = mockEvent('click');

      event.stopPropagation();

      // @ts-ignore Non-standard
      expect(event.propagationStopped).toBe(true);
    });

    it('marks as stopped (via immediate)', () => {
      const event = mockEvent('click');

      event.stopImmediatePropagation();

      // @ts-ignore Non-standard
      expect(event.propagationStopped).toBe(true);
    });
  });

  describe('mockSyntheticEvent()', () => {
    it('returns custom event objects', () => {
      const event = mockSyntheticEvent('onClick');

      expect(event.constructor.name).toBe('SyntheticEvent');
      expect(event.nativeEvent.constructor.name).toBe('BaseEvent');
      expect(event.type).toBe('click');
    });

    it('inherits targets from native event', () => {
      const target = { tagName: 'foo' };
      const event = mockSyntheticEvent('onClick', { target });

      expect(event.target).toBe(event.nativeEvent.target);
    });

    it('marks as persisted', () => {
      const event = mockSyntheticEvent('onClick');

      event.persist();

      // @ts-ignore Not typed upstream
      expect(event.isPersistent()).toBe(true);
    });

    it('calls `preventDefault` on both native and synthetic event', () => {
      const event = mockSyntheticEvent('onClick');
      const spy = jest.spyOn(event.nativeEvent, 'preventDefault');

      event.preventDefault();

      expect(event.isDefaultPrevented()).toBe(true);
      expect(spy).toHaveBeenCalled();
    });

    it('calls `stopPropagation` on both native and synthetic event', () => {
      const event = mockSyntheticEvent('onClick');
      const spy = jest.spyOn(event.nativeEvent, 'stopPropagation');

      event.stopPropagation();

      expect(event.isPropagationStopped()).toBe(true);
      expect(spy).toHaveBeenCalled();
    });

    it('sets keyboard and mouse options', () => {
      const event = mockSyntheticEvent<React.KeyboardEvent>('onKeyDown', {
        ctrlKey: true,
        key: 'Enter',
      });

      expect(event.ctrlKey).toBe(true);
      expect(event.key).toBe('Enter');
    });
  });

  describe('factorySyntheticEvent()', () => {
    const target = { tagName: 'strong' };

    it('creates a synthetic event if nothing passed', () => {
      expect(factorySyntheticEvent('onClick')).toBeInstanceOf(SyntheticEvent);
    });

    it('creates a synthetic event with custom options', () => {
      const event = factorySyntheticEvent('onClick', { target, shiftKey: true });

      expect(event).toBeInstanceOf(SyntheticEvent);
      expect(event.target).toBe(target);
      // @ts-ignore
      expect(event.shiftKey).toBe(true);
    });

    it('sets target automatically based on type', () => {
      const event = factorySyntheticEvent('onClick', {}, 'div');

      expect(event).toBeInstanceOf(SyntheticEvent);
      expect(event.target).toEqual({ tagName: 'DIV' });
    });

    it('doesnt set target automatically if target is defined', () => {
      const event = factorySyntheticEvent('onClick', { target }, 'div');

      expect(event).toBeInstanceOf(SyntheticEvent);
      expect(event.target).toBe(target);
    });

    it('doesnt set target automatically if type not a DOM element', () => {
      const event = factorySyntheticEvent('onClick', {}, FuncComp);

      expect(event).toBeInstanceOf(SyntheticEvent);
      expect(event.target).toEqual({});
    });

    it('returns passed synthetic event', () => {
      const event = new SyntheticEvent('onClick', mockEvent('click'));

      expect(factorySyntheticEvent('onClick', event)).toBe(event);
    });

    it('returns passed synthetic event (from mock)', () => {
      const event = mockSyntheticEvent('onClick');

      expect(factorySyntheticEvent('onClick', event)).toBe(event);
    });
  });
});
