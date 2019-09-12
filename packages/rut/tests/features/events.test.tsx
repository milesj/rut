import React from 'react';
import { render } from '../../src/render';
import { mockSyntheticEvent } from '../../src/mocks/event';

describe('Events', () => {
  interface AsyncCompProps {
    onClick: () => Promise<unknown>;
  }

  class AsyncComp extends React.Component<AsyncCompProps, { value: unknown }> {
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
    const result = render<AsyncCompProps>(<EventComp />);
    const event = mockSyntheticEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>('onClick');
    const spy = jest.spyOn(event, 'preventDefault');

    result.root.findOne('button').dispatch('onClick', event);

    expect(spy).toHaveBeenCalled();
  });
});
