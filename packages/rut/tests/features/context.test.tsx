import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { render } from '../../src/render';

describe('Context', () => {
  const ThemeContext = React.createContext('default');

  interface SpyProps {
    spy: (theme: string) => void;
  }

  interface ProviderProps {
    children: React.ReactNode;
    theme?: string;
  }

  function Provider({ children, theme }: ProviderProps) {
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
    it('renders a provider without consumer, and its children', async () => {
      const result = await render<ProviderProps>(<Provider>Child</Provider>);

      expect(result).toMatchSnapshot();
      expect(result.root).toContainNode('Child');
    });
  });

  describe('Consumer', () => {
    it('renders without provider', async () => {
      const spy = jest.fn();

      await render<SpyProps>(<Consumer spy={spy} />);

      expect(spy).toHaveBeenCalledWith('default');
    });

    it('renders within provider and inherits the defined value', async () => {
      const spy = jest.fn();
      const result = await render<ProviderProps>(
        <Provider theme="dark">
          <div>
            <Consumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(result).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('dark');
    });

    it('updates with new value when provider changes', async () => {
      const spy = jest.fn();
      const result = await render<ProviderProps>(
        <Provider theme="dark">
          <div>
            <Consumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(spy).toHaveBeenCalledWith('dark');

      result.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledWith('light');
    });

    it('updates consumer that has been memoized', async () => {
      const spy = jest.fn();
      const MemoConsumer = React.memo(Consumer);
      const result = await render<ProviderProps>(
        <Provider theme="dark">
          <MemoConsumer spy={spy} />
        </Provider>,
      );

      result.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('light');
    });
  });

  describe('useContext', () => {
    it('renders without provider', async () => {
      const spy = jest.fn();

      await render<SpyProps>(<HookConsumer spy={spy} />);

      expect(spy).toHaveBeenCalledWith('default');
    });

    it('renders within provider and inherits the defined value', async () => {
      const spy = jest.fn();
      const result = await render<ProviderProps>(
        <Provider theme="dark">
          <div>
            <HookConsumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(result).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('dark');
    });

    it('updates with new value when provider changes', async () => {
      const spy = jest.fn();
      const result = await render<ProviderProps>(
        <Provider theme="dark">
          <div>
            <HookConsumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(spy).toHaveBeenCalledWith('dark');

      result.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledWith('light');
    });

    it('updates consumer that has been memoized', async () => {
      const spy = jest.fn();
      const MemoConsumer = React.memo(HookConsumer);
      const result = await render<ProviderProps>(
        <Provider theme="dark">
          <MemoConsumer spy={spy} />
        </Provider>,
      );

      result.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('light');
    });
  });

  describe('contextType', () => {
    it('renders without provider', async () => {
      const spy = jest.fn();

      await render<SpyProps>(<StaticConsumer spy={spy} />);

      expect(spy).toHaveBeenCalledWith('default');
    });

    it('renders within provider and inherits the defined value', async () => {
      const spy = jest.fn();
      const result = await render<ProviderProps>(
        <Provider theme="dark">
          <div>
            <StaticConsumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(result).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('dark');
    });

    it('updates with new value when provider changes', async () => {
      const spy = jest.fn();
      const result = await render<ProviderProps>(
        <Provider theme="dark">
          <div>
            <StaticConsumer spy={spy} />
          </div>
        </Provider>,
      );

      expect(spy).toHaveBeenCalledWith('dark');

      result.update({ theme: 'light' });

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
      const result = await render<ProviderProps>(
        <Provider theme="dark">
          <PureStaticConsumer spy={spy} />
        </Provider>,
      );

      result.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('light');
    });
  });

  describe('legacy', () => {
    class ParentContext extends React.Component<{ children: React.ReactNode; theme?: string }> {
      static childContextTypes = {
        theme: PropTypes.string,
      };

      getChildContext() {
        return { theme: this.props.theme || 'light' };
      }

      render() {
        return <>{this.props.children}</>;
      }
    }

    class ChildContext extends React.Component<SpyProps> {
      static contextTypes = {
        theme: PropTypes.string,
      };

      render() {
        this.props.spy(this.context.theme);

        return <div>Consumed!</div>;
      }
    }

    it('renders without provider', async () => {
      const spy = jest.fn();

      await render<SpyProps>(<ChildContext spy={spy} />);

      expect(spy).toHaveBeenCalledWith(undefined);
    });

    it('renders within parent and inherits the defined value', async () => {
      const spy = jest.fn();
      const result = await render<ProviderProps>(
        <ParentContext theme="dark">
          <div>
            <ChildContext spy={spy} />
          </div>
        </ParentContext>,
      );

      expect(result).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('dark');
    });

    it('updates with new value when provider changes', async () => {
      const spy = jest.fn();
      const result = await render<ProviderProps>(
        <ParentContext theme="dark">
          <div>
            <ChildContext spy={spy} />
          </div>
        </ParentContext>,
      );

      expect(spy).toHaveBeenCalledWith('dark');

      result.update({ theme: 'light' });

      expect(spy).toHaveBeenCalledWith('light');
    });
  });
});
