import React from 'react';
import { render } from '../../src';

describe('Children', () => {
  it('renders a function child', () => {
    function FuncChildComp({ children }: { children: () => React.ReactNode }) {
      return <div>{children()}</div>;
    }

    const spy = jest.fn(() => <span>Child</span>);
    const result = render<{}>(<FuncChildComp>{spy}</FuncChildComp>);

    expect(result).toMatchSnapshot();
    expect(result.root).toContainNode('Child');
    expect(spy).toHaveBeenCalled();
  });

  it('renders an only child', () => {
    interface Props {
      children: React.ReactNode;
    }

    function OnlyChildComp({ children }: Props) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{React.Children.only(children)}</>;
    }

    const node = <span>Child</span>;
    const result = render<Props>(<OnlyChildComp>{node}</OnlyChildComp>);

    expect(result).toMatchSnapshot();
    expect(result.root).toContainNode(node);
  });

  it('renders mapped children', () => {
    interface Props {
      children: React.ReactNode;
    }

    function MapChildComp({ children }: Props) {
      return (
        <ul>
          {React.Children.map(children, (child) => (
            <li>{child}</li>
          ))}
        </ul>
      );
    }

    const result = render<Props>(
      <MapChildComp>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </MapChildComp>,
    );

    expect(result).toMatchSnapshot();
    expect(result.root.find('li')).toHaveLength(3);
  });
});
