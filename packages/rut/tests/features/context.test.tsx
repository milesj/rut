import React, { useContext } from 'react';
import render from '../../src/render';

describe('Context', () => {
  const ThemeContext = React.createContext('default');

  interface SpyProps {
    spy: (theme: string) => void;
  }

  function Provider({ children, theme }: { children: React.ReactNode; theme?: string }) {
    return <ThemeContext.Provider value={theme || 'light'}>{children}</ThemeContext.Provider>;
  }

  function Consumer({ spy }: SpyProps) {
    return (
      <ThemeContext.Consumer>
        {theme => {
          spy(theme);

          return <div>Consumed!</div>;
        }}
      </ThemeContext.Consumer>
    );
  }

  function HookConsumer({ spy }: SpyProps) {
    const theme = useContext(ThemeContext);

    spy(theme);

    return <div>Consumed!</div>;
  }

  class StaticConsumer extends React.Component<SpyProps> {
    static contextType = ThemeContext;

    render() {
      this.props.spy(this.context);

      return <div>Consumed!</div>;
    }
  }

  describe('Provider', () => {
    it('renders a provider without consumer, and its children', () => {
      const wrapper = render(<Provider>Child</Provider>);

      expect(wrapper.debug()).toMatchSnapshot();
      expect(wrapper.root).toContainNode('Child');
    });
  });

  describe('Consumer', () => {
    it('renders without provider', () => {
      const spy = jest.fn();

      render(<Consumer spy={spy} />);

      expect(spy).toHaveBeenCalledWith('default');
    });

    it('renders within provider and inherits the defined value', () => {
      const spy = jest.fn();
      const wrapper = render(
        <Provider theme="dark">
          <div>
            <Consumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(wrapper.debug()).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('dark');
    });

    it('updates with new value when provider changes', async () => {
      const spy = jest.fn();
      const wrapper = render(
        <Provider theme="dark">
          <div>
            <Consumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(spy).toHaveBeenCalledWith('dark');

      await wrapper.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledWith('light');
    });

    it('updates consumer that has been memoized', async () => {
      const spy = jest.fn();
      const MemoConsumer = React.memo(Consumer);
      const wrapper = render(
        <Provider theme="dark">
          <MemoConsumer spy={spy} />
        </Provider>,
      );

      await wrapper.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('light');
    });
  });

  describe('useContext', () => {
    it('renders without provider', () => {
      const spy = jest.fn();

      render(<HookConsumer spy={spy} />);

      expect(spy).toHaveBeenCalledWith('default');
    });

    it('renders within provider and inherits the defined value', () => {
      const spy = jest.fn();
      const wrapper = render(
        <Provider theme="dark">
          <div>
            <HookConsumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(wrapper.debug()).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('dark');
    });

    it('updates with new value when provider changes', async () => {
      const spy = jest.fn();
      const wrapper = render(
        <Provider theme="dark">
          <div>
            <HookConsumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(spy).toHaveBeenCalledWith('dark');

      await wrapper.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledWith('light');
    });

    it('updates consumer that has been memoized', async () => {
      const spy = jest.fn();
      const MemoConsumer = React.memo(HookConsumer);
      const wrapper = render(
        <Provider theme="dark">
          <MemoConsumer spy={spy} />
        </Provider>,
      );

      await wrapper.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('light');
    });
  });

  describe('contextType', () => {
    it('renders without provider', () => {
      const spy = jest.fn();

      render(<StaticConsumer spy={spy} />);

      expect(spy).toHaveBeenCalledWith('default');
    });

    it('renders within provider and inherits the defined value', () => {
      const spy = jest.fn();
      const wrapper = render(
        <Provider theme="dark">
          <div>
            <StaticConsumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(wrapper.debug()).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('dark');
    });

    it('updates with new value when provider changes', async () => {
      const spy = jest.fn();
      const wrapper = render(
        <Provider theme="dark">
          <div>
            <StaticConsumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(spy).toHaveBeenCalledWith('dark');

      await wrapper.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledWith('light');
    });

    it('updates consumer that is pure', async () => {
      class PureStaticConsumer extends React.PureComponent<SpyProps> {
        static contextType = ThemeContext;

        render() {
          this.props.spy(this.context);

          return <div>Consumed!</div>;
        }
      }

      const spy = jest.fn();
      const wrapper = render(
        <Provider theme="dark">
          <PureStaticConsumer spy={spy} />
        </Provider>,
      );

      await wrapper.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('light');
    });
  });
});
