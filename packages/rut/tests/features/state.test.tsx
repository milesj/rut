import React, { useState } from 'react';
import { render } from '../../src/render';
import mockSyntheticEvent from '../../src/mocks/event';

describe('State', () => {
  describe('class components', () => {
    class StatefulComp extends React.Component<{}, { active: boolean }> {
      state = {
        active: false,
      };

      handleToggle = () => {
        this.setState(prevState => ({
          active: !prevState.active,
        }));
      };

      render() {
        return (
          <div>
            <div>{this.state.active ? 'Active' : 'Inactive'}</div>
            <button type="button" onClick={this.handleToggle}>
              Toggle
            </button>
          </div>
        );
      }
    }

    it('re-renders when state changes', () => {
      const result = render(<StatefulComp />);

      expect(result).toMatchSnapshot();
      expect(result.root).toContainNode('Inactive');

      result.root.findOne('button').emit('onClick', mockSyntheticEvent('click'));

      expect(result).toMatchSnapshot();
      expect(result.root).toContainNode('Active');
    });
  });

  describe('function components (`useState` hook)', () => {
    function StatefulComp() {
      const [active, setActive] = useState(false);
      const handleToggle = () => {
        setActive(!active);
      };

      return (
        <div>
          <div>{active ? 'Active' : 'Inactive'}</div>
          <button type="button" onClick={handleToggle}>
            Toggle
          </button>
        </div>
      );
    }

    it('re-renders when state changes', () => {
      const result = render(<StatefulComp />);

      expect(result).toMatchSnapshot();
      expect(result.root).toContainNode('Inactive');

      result.root.findOne('button').emit('onClick', mockSyntheticEvent('click'));

      expect(result).toMatchSnapshot();
      expect(result.root).toContainNode('Active');
    });
  });
});
