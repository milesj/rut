import React from 'react';
import { render } from '../src/render';
import { whereKey, whereProps } from '../src/predicates';

describe('predicates', () => {
  describe('whereKey()', () => {
    it('returns all elements with the defined key', () => {
      const { root } = render(
        <ul>
          <li key="1">1</li>
          <li key="2">2</li>
          <li key="3">3</li>
        </ul>,
      );

      expect(root.query(whereKey('1'))).toHaveLength(1);
    });

    it('returns multiple elements using an array', () => {
      const { root } = render(
        <ul>
          <li key="1">1</li>
          <li key="2">2</li>
          <li key="3">3</li>
        </ul>,
      );

      expect(root.query(whereKey(['1', '3']))).toHaveLength(2);
    });

    it('returns all elements from any depth', () => {
      const { root } = render(
        <ul>
          <li key="1">1</li>
          <li key="2">2</li>
          <li key="3">
            <ul>
              <li key="1">1</li>
              <li key="2">2</li>
              <li key="3">3</li>
            </ul>
          </li>
        </ul>,
      );

      expect(root.query(whereKey('1'))).toHaveLength(2);
    });
  });

  describe('whereProps()', () => {
    it('returns all elements that match the props', () => {
      const { root } = render(
        <div>
          <input type="text" name="foo" disabled />
          <input type="text" name="bar" />
          <input type="password" name="baz" disabled />
        </div>,
      );

      expect(root.query(whereProps({ type: 'text' }))).toHaveLength(2);
      expect(root.query(whereProps({ disabled: true }))).toHaveLength(2);
      expect(root.query(whereProps({ type: 'text', disabled: true }))).toHaveLength(1);
      expect(root.query(whereProps({ type: 'text', disabled: true, name: 'baz' }))).toHaveLength(0);
    });

    it('returns all elements from any depth', () => {
      const { root } = render(
        <div>
          <input type="text" name="foo" />

          <div>
            <input type="text" name="bar" />

            <div>
              <input type="text" name="baz" />
            </div>
          </div>
        </div>,
      );

      expect(root.query(whereProps({ type: 'text' }))).toHaveLength(3);
      expect(root.query(whereProps({ type: 'text', name: 'foo' }))).toHaveLength(1);
    });
  });
});
