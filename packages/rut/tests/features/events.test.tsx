import React from 'react';
import { render } from '../../src/render';

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

  it('can await the result of an emit', async () => {
    const result = render(<AsyncComp onClick={() => Promise.resolve('Updated!')} />);

    const value = await result.root.findOne('button').emit('onClick');

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
    const event = { preventDefault: jest.fn() };
    const result = render(<EventComp />);

    result.root.findOne('button').emit('onClick', event);

    expect(event.preventDefault).toHaveBeenCalled();
  });
});
