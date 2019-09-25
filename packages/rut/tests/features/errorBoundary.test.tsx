import React from 'react';
import { render } from '../../src/render';

describe('ErrorBoundary', () => {
  interface State {
    error: Error | null;
  }

  interface Props {
    children: React.ReactNode;
    spy: (error: Error, info: object) => void;
  }

  class ErrorBoundary extends React.Component<Props, State> {
    state: State = {
      error: null,
    };

    static getDerivedStateFromError(error: Error) {
      return { error };
    }

    componentDidCatch(error: Error, info: object) {
      this.props.spy(error, info);
    }

    render() {
      const { error } = this.state;

      if (error) {
        return <div>{error.message}</div>;
      }

      return <section>{this.props.children}</section>;
    }
  }

  const oldError = console.error;

  beforeEach(() => {
    console.error = () => {};
  });

  afterEach(() => {
    console.error = oldError;
  });

  it('renders the child if no error', async () => {
    const spy = jest.fn();
    const result = await render<Props>(
      <ErrorBoundary spy={spy}>
        <div>Content</div>
      </ErrorBoundary>,
    );

    expect(result).toMatchSnapshot();
    expect(result.root).toContainNode('Content');
  });

  it('renders and logs a caught error', async () => {
    function BrokenComponent() {
      throw new Error('Oops!');
    }

    const spy = jest.fn();
    const result = await render<Props>(
      <ErrorBoundary spy={spy}>
        // @ts-ignore
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(result).toMatchSnapshot();
    expect(result.root).toContainNode('Oops!');
    expect(spy).toHaveBeenCalledWith(new Error('Oops!'), { componentStack: expect.any(String) });
  });
});
