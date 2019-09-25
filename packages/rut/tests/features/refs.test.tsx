import React from 'react';
import { render } from '../../src/render';

describe('Refs', () => {
  const mock = { tagName: 'BUTTON' };

  describe('forwardRef', () => {
    interface ButtonProps {
      children: React.ReactNode;
    }

    const Button = React.forwardRef(
      ({ children }: ButtonProps, ref: React.Ref<HTMLButtonElement>) => {
        return (
          <button type="button" ref={ref}>
            {children}
          </button>
        );
      },
    );

    it('resolves the ref from the inner component', async () => {
      const ref = React.createRef<HTMLButtonElement>();
      const result = await render<ButtonProps>(<Button ref={ref}>Child</Button>, {
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

          // @ts-ignore
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

    const HocButton = withRef(InnerButton);

    it('resolves the ref from the HOC', async () => {
      const ref = React.createRef<HTMLButtonElement>();

      expect(ref.current).toBeNull();

      const result = await render<ButtonProps>(<HocButton ref={ref}>Child</HocButton>);

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

    it('resolves the ref', async () => {
      const div = { tagName: 'DIV' };
      const result = await render<{}>(<Section>Child</Section>, {
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
            ref={ref => {
              this.inputRef = ref;
            }}
          />
        );
      }
    }

    it('resolves the callback ref', async () => {
      const input = { tagName: 'INPUT' };
      const result = await render<InputProps>(<Input value="foo" />, {
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

    it('resolves the string ref', async () => {
      const a = { tagName: 'A' };
      const result = await render<LinkProps>(<Link href="/">Child</Link>, {
        mockRef: () => a,
      });

      expect(result).toMatchSnapshot();
      expect(result.root.ref('link')).toBe(a);
    });
  });
});
