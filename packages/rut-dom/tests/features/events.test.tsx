import React from 'react';
import { mockSyntheticEvent, render } from '../../src';

describe('Events', () => {
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
    const result = render<{}>(<EventComp />);
    const event = mockSyntheticEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>('onClick');
    const spy = jest.spyOn(event, 'preventDefault');

    result.root.findOne('button').dispatch('onClick', event);

    expect(spy).toHaveBeenCalled();
  });
});
