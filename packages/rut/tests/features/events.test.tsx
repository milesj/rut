import React from 'react';
import { render } from '../../src/render';
import { mockSyntheticEvent } from '../../src/mocks/event';

describe('Events', () => {
  class AsyncComp extends React.Component<{ onClick: () => Promise<unknown> }, { value: unknown }> {
    state = {
      value: '',
    };

    handleClick = async () => {
      let value = null;

      try {
        value = await this.props.onClick();

        this.setState({ value });
      } catch {
        // Skip
      }

      return value;
    };

    render() {
      return (
        <div>
          <div>{this.state.value}</div>

          <button type="button" onClick={this.handleClick}>
            Trigger
          </button>
        </div>
      );
    }
  }

  it('can await the result of an dispatch', async () => {
    const result = render(<AsyncComp onClick={() => Promise.resolve('Updated!')} />);

    const value = await result.root
      .findOne('button')
      .dispatch('onClick', {}, mockSyntheticEvent('onClick'));

    expect(value).toBe('Updated!');
    expect(result.root).toContainNode('Updated!');
  });

  function EventComp() {
    const handleClick = (event: React.MouseEvent) => {
      event.preventDefault();
    };

    return (
      <div>
        <button type="button" onClick={handleClick}>
          Trigger
        </button>
      </div>
    );
  }

  it('can call methods on the event object', () => {
    const result = render(<EventComp />);
    const event = mockSyntheticEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>('onClick');
    const spy = jest.spyOn(event, 'preventDefault');

    result.root.findOne('button').dispatch('onClick', {}, event);

    expect(spy).toHaveBeenCalled();
  });
});
