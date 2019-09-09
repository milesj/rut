import React from 'react';
import { render } from '../../src/render';

describe('Props', () => {
  it('supports primitives and scalars', () => {
    interface PrimitiveCompProps {
      count: number;
      node: React.ReactNode;
      text: string;
    }

    function PrimitiveComp({ count, node, text }: PrimitiveCompProps) {
      return (
        <div>
          <h1>{text}</h1>
          <section>Count: {count.toLocaleString()}</section>
          <aside>{node}</aside>
        </div>
      );
    }

    const result = render<PrimitiveCompProps>(
      <PrimitiveComp
        count={123456}
        node={<div>This is a sidebar!</div>}
        text="This is a string of text."
      />,
    );

    expect(result).toMatchSnapshot();
  });

  it('supports render props', () => {
    interface RenderPropCompProps {
      renderItem: (value: number) => React.ReactNode;
    }

    function RenderPropComp({ renderItem }: RenderPropCompProps) {
      return <div>{renderItem(123)}</div>;
    }

    const result = render<RenderPropCompProps>(
      <RenderPropComp renderItem={value => <b>{value * 2}</b>} />,
    );

    expect(result).toMatchSnapshot();
    expect(result.root).toContainNode(246);
  });
});
