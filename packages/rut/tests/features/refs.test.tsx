import React from 'react';
import render from '../../src/render';

describe('Refs', () => {
  const mock = { tagName: 'BUTTON' };

  describe('forwardRef', () => {
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
      const wrapper = render(<Button ref={ref}>Child</Button>, {
        refs: { button: mock },
      });

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.root.ref()).toBe(ref);
      expect(wrapper.root.ref<typeof ref>()!.current).toBe(mock);
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

    it('resolves the ref from the HOC', () => {
      const ref = React.createRef<HTMLButtonElement>();

      expect(ref.current).toBeNull();

      const wrapper = render(<HocButton ref={ref}>Child</HocButton>);

      expect(wrapper).toMatchSnapshot();
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
      const wrapper = render(<Section>Child</Section>, {
        refs: { div },
      });

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.root.ref('ref')).toEqual({ current: div });
    });
  });

  describe('callback refs', () => {
    class Input extends React.Component<{ value: string }> {
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

    it('resolves the callback ref', () => {
      const input = { tagName: 'INPUT' };
      const wrapper = render(<Input value="foo" />, {
        refs: { input },
      });

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.root.ref('inputRef')).toBe(input);
    });
  });

  describe('string refs', () => {
    class Link extends React.Component<{ children: React.ReactNode; href: string }> {
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
      const wrapper = render(<Link href="/">Child</Link>, {
        refs: { a },
      });

      expect(wrapper).toMatchSnapshot();
      expect(wrapper.root.ref('link')).toBe(a);
    });
  });
});
