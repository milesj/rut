import React from 'react';
import render from '../../src/render';

describe('ForwardRef', () => {
  const mock = { tagName: 'BUTTON' };

  describe('common', () => {
    const Button = React.forwardRef(
      ({ children }: { children: React.ReactNode }, ref: React.Ref<HTMLButtonElement>) => {
        return (
          <button type="button" ref={ref}>
            {children}
          </button>
        );
      },
    );

    it('resolves the ref from the inner component', () => {
      const ref = React.createRef<HTMLButtonElement>();

      expect(ref.current).toBeNull();

      const wrapper = render(<Button ref={ref}>Child</Button>, {
        refs: { button: mock },
      });

      expect(wrapper.debug()).toMatchSnapshot();
      expect(ref.current).toBe(mock);
    });
  });

  describe('HOC', () => {
    function withRef(WrappedComponent: React.ComponentType<{ children: React.ReactNode }>): any {
      class WithRef extends React.Component<{ forwardedRef?: React.Ref<unknown> | null }> {
        render() {
          const { forwardedRef, ...rest } = this.props;

          return <WrappedComponent ref={forwardedRef} {...rest} />;
        }
      }

      return React.forwardRef((props, ref) => {
        return <WithRef {...props} forwardedRef={ref} />;
      });
    }

    class InnerButton extends React.Component<{ children: React.ReactNode }> {
      render() {
        return <button type="button">{this.props.children}</button>;
      }
    }

    const Button = withRef(InnerButton);

    it('resolves the ref from the HOC', () => {
      const ref = React.createRef<HTMLButtonElement>();

      expect(ref.current).toBeNull();

      const wrapper = render(<Button ref={ref}>Child</Button>);

      expect(wrapper.debug()).toMatchSnapshot();
      expect(ref.current!.constructor.name).toBe('InnerButton');
    });
  });
});
