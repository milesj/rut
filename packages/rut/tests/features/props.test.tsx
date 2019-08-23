import React from 'react';
import { render } from '../../src/render';

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

    const result = render(
      <PrimitiveComp
        count={123456}
        node={<div>This is a sidebar!</div>}
        text="This is a string of text."
      />,
    );

    expect(result).toMatchSnapshot();
  });

  it('supports render props', () => {
    function RenderPropComp({ renderItem }: { renderItem: (value: number) => React.ReactNode }) {
      return <div>{renderItem(123)}</div>;
    }

    const result = render(<RenderPropComp renderItem={value => <b>{value * 2}</b>} />);

    expect(result).toMatchSnapshot();
    expect(result.root).toContainNode(246);
  });
});
