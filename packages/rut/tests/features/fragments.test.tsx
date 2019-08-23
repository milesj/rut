import React from 'react';
import { render } from '../../src/render';

describe('Fragment', () => {
  it('renders short form', () => {
    function Items() {
      return (
        <>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </>
      );
    }

    const wrapper = render(
      <ul>
        <Items />
      </ul>,
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.root).toContainNode('Two');
    expect(wrapper.root.find('li')).toHaveLength(3);
  });

  it('renders long form', () => {
    function Items() {
      return (
        // eslint-disable-next-line react/jsx-fragments
        <React.Fragment>
          <li>One</li>
          <li>Two</li>
          <li>Three</li>
        </React.Fragment>
      );
    }

    const wrapper = render(
      <ul>
        <Items />
      </ul>,
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.root).toContainNode('Three');
    expect(wrapper.root.find('li')).toHaveLength(3);
  });
});
