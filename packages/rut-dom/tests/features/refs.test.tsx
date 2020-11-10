import React from 'react';
import { render } from '../../src';

describe('Refs', () => {
  const mock = { tagName: 'BUTTON' };

  describe('forwardRef', () => {
    interface ButtonProps {
      children: React.ReactNode;
    }

    const Button = React.forwardRef(
      ({ children }: ButtonProps, ref: React.Ref<HTMLButtonElement>) => (
        <button type="button" ref={ref}>
          {children}
        </button>
      ),
    );

    it('resolves the ref from the inner component', () => {
      const ref = React.createRef<HTMLButtonElement>();
      const result = render<ButtonProps>(<Button ref={ref}>Child</Button>, {
        mockRef: () => mock,
      });

      expect(result).toMatchSnapshot();
      expect(result.root.ref()).toBe(ref);
      expect(result.root.ref<typeof ref>()!.current).toBe(mock);
    });

    function withRef(WrappedComponent: React.ComponentType<{ children: React.ReactNode }>): any {
      class WithRef extends React.Component<{ forwardedRef?: React.Ref<unknown> | null }> {
        render() {
          const { forwardedRef, ...rest } = this.props;

          // @ts-expect-error
          return <WrappedComponent ref={forwardedRef} {...rest} />;
        }
      }

      return React.forwardRef((props, ref) => <WithRef {...props} forwardedRef={ref} />);
    }

    class InnerButton extends React.Component<{ children: React.ReactNode }> {
      render() {
        return <button type="button">{this.props.children}</button>;
      }
    }

    const HocButton = withRef(InnerButton);

    it('resolves the ref from the HOC', () => {
      const ref = React.createRef<HTMLButtonElement>();

      expect(ref.current).toBeNull();

      const result = render<ButtonProps>(<HocButton ref={ref}>Child</HocButton>);

      expect(result).toMatchSnapshot();
      expect(ref.current!.constructor.name).toBe('InnerButton');
    });
  });

  describe('createRef', () => {
    class Section extends React.Component<{ children: React.ReactNode }> {
      ref = React.createRef<HTMLDivElement>();

      render() {
        return <div ref={this.ref}>{this.props.children}</div>;
      }
    }

    it('resolves the ref', () => {
      const div = { tagName: 'DIV' };
      const result = render<{}>(<Section>Child</Section>, {
        mockRef: () => div,
      });

      expect(result).toMatchSnapshot();
      expect(result.root.ref('ref')).toEqual({ current: div });
    });
  });

  describe('callback refs', () => {
    interface InputProps {
      value: string;
    }

    class Input extends React.Component<InputProps> {
      inputRef: HTMLInputElement | null = null;

      render() {
        return (
          <input
            value={this.props.value}
            ref={(ref) => {
              this.inputRef = ref;
            }}
          />
        );
      }
    }

    it('resolves the callback ref', () => {
      const input = { tagName: 'INPUT' };
      const result = render<InputProps>(<Input value="foo" />, {
        mockRef: () => input,
      });

      expect(result).toMatchSnapshot();
      expect(result.root.ref('inputRef')).toBe(input);
    });
  });

  describe('string refs', () => {
    interface LinkProps {
      children: React.ReactNode;
      href: string;
    }

    class Link extends React.Component<LinkProps> {
      render() {
        return (
          // eslint-disable-next-line react/no-string-refs
          <a href={this.props.href} ref="link">
            {this.props.children}
          </a>
        );
      }
    }

    it('resolves the string ref', () => {
      const a = { tagName: 'A' };
      const result = render<LinkProps>(<Link href="/">Child</Link>, {
        mockRef: () => a,
      });

      expect(result).toMatchSnapshot();
      expect(result.root.ref('link')).toBe(a);
    });
  });
});
