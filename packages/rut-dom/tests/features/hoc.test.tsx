import React from 'react';
import { render } from '../../src';

describe('HOCs', () => {
  interface WithStylesProps {
    styles: object;
  }

  // Factory style
  function withStyles() {
    return function withStylesFactory<P>(
      WrappedComponent: React.ComponentType<P & WithStylesProps>,
    ) {
      function WithStyles(props: P) {
        return <WrappedComponent {...props} styles={{ color: 'green' }} />;
      }

      WithStyles.displayName = `withStyles(${
        WrappedComponent.displayName || WrappedComponent.name
      })`;

      return WithStyles;
    };
  }

  interface WrappedProps {
    id: number;
  }

  class Wrapped extends React.Component<WithStylesProps & WrappedProps> {
    render() {
      return <div>Styled!</div>;
    }
  }

  it('can render the wrapped component + hoc', () => {
    const StyledComp = withStyles()(Wrapped);
    const result = render<WrappedProps>(<StyledComp id={1} />);

    expect(result).toMatchSnapshot();
  });

  it('returns the result HOC as the root', () => {
    const StyledComp = withStyles()(Wrapped);
    const { root } = render<WrappedProps>(<StyledComp id={2} />);

    expect(root.name()).toBe('withStyles(Wrapped)');
    expect(root).toHaveProps({ id: 2 });
  });

  it('can find the wrapped component', () => {
    const StyledComp = withStyles()(Wrapped);
    const { root } = render<WrappedProps>(<StyledComp id={3} />);

    expect(root.find(Wrapped)).toHaveLength(1);
    expect(root.findOne(Wrapped)).toHaveProps({ id: 3, styles: { color: 'green' } });
  });

  interface ConnectProps {
    connected: true;
  }

  // Non-factory style
  function connect<P>(WrappedComponent: React.ComponentType<ConnectProps & P>) {
    function Connect(props: P) {
      return <WrappedComponent {...props} connected />;
    }

    Connect.displayName = `connect(${WrappedComponent.displayName || WrappedComponent.name})`;

    return Connect;
  }

  class DeepWrapped extends React.Component<ConnectProps & WithStylesProps & { id: number }> {
    render() {
      return <div>Styled!</div>;
    }
  }

  it('supports multiple layers of HOCs', () => {
    const DeepComp = connect(withStyles()(DeepWrapped));
    const result = render<WrappedProps>(<DeepComp id={4} />);

    expect(result).toMatchSnapshot();
  });
});
