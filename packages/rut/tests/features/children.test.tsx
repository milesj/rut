import React from 'react';
import { render } from '../../src/render';

describe('Children', () => {
  it('renders a function child', () => {
    function FuncChildComp({ children }: { children: () => React.ReactNode }) {
      return <div>{children()}</div>;
    }

    const spy = jest.fn(() => <span>Child</span>);
    const wrapper = render(<FuncChildComp>{spy}</FuncChildComp>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.root).toContainNode('Child');
    expect(spy).toHaveBeenCalled();
  });

  it('renders an only child', () => {
    function OnlyChildComp({ children }: { children: React.ReactNode }) {
      return <>{React.Children.only(children)}</>;
    }

    const node = <span>Child</span>;
    const wrapper = render(<OnlyChildComp>{node}</OnlyChildComp>);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.root).toContainNode(node);
  });

  it('renders mapped children', () => {
    function MapChildComp({ children }: { children: React.ReactNode }) {
      return (
        <ul>
          {React.Children.map(children, child => (
            <li>{child}</li>
          ))}
        </ul>
      );
    }

    const wrapper = render(
      <MapChildComp>
        <div>1</div>
        <div>2</div>
        <div>3</div>
      </MapChildComp>,
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.root.find('li')).toHaveLength(3);
  });
});
