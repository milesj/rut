import React from 'react';
import render from '../../src/render';

describe('Props', () => {
  it('supports primitives and scalars', () => {
    function PrimitiveComp({
      count,
      node,
      text,
    }: {
      count: number;
      node: React.ReactNode;
      text: string;
    }) {
      return (
        <div>
          <h1>{text}</h1>
          <section>Count: {count.toLocaleString()}</section>
          <aside>{node}</aside>
        </div>
      );
    }

    const wrapper = render(
      <PrimitiveComp
        count={123456}
        node={<div>This is a sidebar!</div>}
        text="This is a string of text."
      />,
    );

    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('supports render props', () => {
    function RenderPropComp({ renderItem }: { renderItem: (value: number) => React.ReactNode }) {
      return <div>{renderItem(123)}</div>;
    }

    const wrapper = render(<RenderPropComp renderItem={value => <b>{value * 2}</b>} />);

    expect(wrapper.debug()).toMatchSnapshot();
    expect(wrapper.root).toContainNode(246);
  });
});
