import React from 'react';
import Element from '../src/Element';
import { render } from '../src/render';
import { FuncComp } from './fixtures';

describe('Element', () => {
  describe('children()', () => {
    it('returns an empty array when no children (null return)', () => {
      function NullComp() {
        return null;
      }

      const { root } = render(<NullComp />);

      expect(root.children()).toEqual([]);
    });

    it('returns as strings and elements', () => {
      function StringComp() {
        return (
          <div>
            Foo
            <br />
            Bar
          </div>
        );
      }

      const { root } = render(<StringComp />);

      expect(root.findOne('div').children()).toEqual(['Foo', expect.any(Element), 'Bar']);
    });
  });

  describe('emit()', () => {
    it('errors if prop does not exist', () => {
      expect(() => {
        const { root } = render(<FuncComp />);

        root.emit('onFake');
      }).toThrowError('Prop `onFake` does not exist.');
    });

    it('errors if prop is not a function', () => {
      expect(() => {
        const { root } = render(<FuncComp name="func" />);

        root.emit('name');
      }).toThrowError('Prop `name` is not a function.');
    });

    it('errors if emitting on a non-host component', () => {
      function EmitComp(props: { onSomething: () => void }) {
        return <div />;
      }

      expect(() => {
        const { root } = render(<EmitComp onSomething={() => {}} />);

        root.emit('onSomething');
      }).toThrowError('Emitting events is only allowed on host components (HTML elements).');
    });

    it('executes the function prop', () => {
      const spy = jest.fn();

      function EmitComp() {
        return (
          <button type="button" onClick={spy}>
            Click
          </button>
        );
      }

      const { root } = render(<EmitComp />);

      root.findOne('button').emit('onClick', 1, 2, 3);

      expect(spy).toHaveBeenCalledWith(1, 2, 3);
    });
  });
});
