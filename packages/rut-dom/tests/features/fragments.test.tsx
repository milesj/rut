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

    const result = render(
      <ul>
        <Items />
      </ul>,
    );

    expect(result).toMatchSnapshot();
    expect(result.root).toContainNode('Two');
    expect(result.root.find('li')).toHaveLength(3);
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

    const result = render(
      <ul>
        <Items />
      </ul>,
    );

    expect(result).toMatchSnapshot();
    expect(result.root).toContainNode('Three');
    expect(result.root.find('li')).toHaveLength(3);
  });
});
