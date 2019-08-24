import React, { useReducer, useCallback, useMemo, useRef } from 'react';
import { render } from '../../src/render';
import { mockSyntheticEvent } from '../../src/mocks/event';

// useState, useContext, useEffect covered in other tests
describe('Hooks', () => {
  describe('useReducer()', () => {
    function reducer(state: { count: number }, action: { type: string }) {
      switch (action.type) {
        case 'increment':
          return { count: state.count + 1 };
        case 'decrement':
          return { count: state.count - 1 };
        default:
          throw new Error('Unknown');
      }
    }

    function CounterComp() {
      const [state, dispatch] = useReducer(reducer, { count: 0 });

      return (
        <>
          Count: <span>{state.count}</span>
          <button type="button" onClick={() => dispatch({ type: 'increment' })}>
            +
          </button>
          <button type="button" onClick={() => dispatch({ type: 'decrement' })}>
            -
          </button>
        </>
      );
    }

    it('re-renders when state changes', () => {
      const { root } = render(<CounterComp />);

      expect(root.findOne('span')).toContainNode(0);

      root.find('button')[0].emit('onClick', mockSyntheticEvent('click'));

      expect(root.findOne('span')).toContainNode(1);

      root.find('button')[1].emit('onClick', mockSyntheticEvent('click'));

      expect(root.findOne('span')).toContainNode(0);
    });
  });

  describe('useCallback()', () => {
    function CallbackComp({ id }: { id: string }) {
      const cb = useCallback(() => 123, []);

      return (
        <button id={id} type="button" onClick={cb}>
          Click
        </button>
      );
    }

    it('persists reference between updates', () => {
      const { root, update } = render(<CallbackComp id="1" />);

      const cb = root.findOne('button').prop('onClick');

      update({ id: '2' });

      expect(root.findOne('button').prop('onClick')).toBe(cb);
    });
  });

  describe('useMemo()', () => {
    function MemoComp({ id }: { id: string }) {
      const value = useMemo(() => Date.now(), []);

      return <span id={id}>{value}</span>;
    }

    it('persists reference between updates', () => {
      const { root, update } = render(<MemoComp id="1" />);

      const value = root.findOne('span').prop('children');

      update({ id: '2' });

      expect(root.findOne('span').prop('children')).toBe(value);
    });
  });

  describe('useRef()', () => {
    function RefComp() {
      const ref = useRef<HTMLInputElement | null>(null);
      const onClick = () => {
        ref.current!.focus();
      };

      return (
        <>
          <input ref={ref} type="text" />
          <button type="button" onClick={onClick}>
            Focus
          </button>
        </>
      );
    }

    it('sets and handles refs', () => {
      const spy = jest.fn();
      const { root } = render(<RefComp />, {
        mockRef: () => ({ focus: spy }),
      });

      root.findOne('button').emit('onClick', mockSyntheticEvent('click'));

      expect(spy).toHaveBeenCalled();
    });
  });
});
