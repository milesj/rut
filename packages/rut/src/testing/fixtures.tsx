/* eslint-disable max-classes-per-file, react/prefer-stateless-function */

import React, { useState, useEffect } from 'react';
import { runAsyncCall } from './helpers';

export interface TestProps {
  children?: React.ReactNode;
  name?: string;
}

export function FuncComp({ children }: TestProps) {
  return <span>{children}</span>;
}

export function FuncCompWithDisplayName(props: TestProps) {
  return <span />;
}

FuncCompWithDisplayName.displayName = 'CustomFuncName';

export class ClassComp extends React.Component<TestProps> {
  render() {
    return <div />;
  }
}

export class ClassCompWithDisplayName extends React.Component<TestProps> {
  static displayName = 'CustomCompName';

  render() {
    return <div />;
  }
}

export const TestContext = React.createContext('');

TestContext.displayName = 'TestContext';

export const ForwardRefComp = React.forwardRef((props, ref) => {
  // @ts-ignore
  return <ClassComp {...props} ref={ref} />;
});

export const LazyComp = React.lazy(() => Promise.resolve({ default: FuncComp }));

export const MemoComp = React.memo(FuncComp);

export interface AsyncProps {
  id?: string;
  onLoad: () => void;
}

export interface AsyncState {
  initialized: boolean;
}

export class AsyncCdmComp extends React.Component<AsyncProps, AsyncState> {
  state = {
    initialized: false,
  };

  async componentDidMount() {
    await runAsyncCall(this.props.onLoad);

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      initialized: true,
    });
  }

  render() {
    return <span>{this.state.initialized ? 'Loaded' : 'Loading...'}</span>;
  }
}

export class AsyncCduComp extends React.Component<AsyncProps, AsyncState> {
  state = {
    initialized: false,
  };

  async componentDidUpdate(prevProps: AsyncProps) {
    if (this.props.id !== prevProps.id) {
      await runAsyncCall(this.props.onLoad);

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        initialized: true,
      });
    }
  }

  render() {
    return <span>{this.state.initialized ? 'Loaded' : 'Loading...'}</span>;
  }
}

export function AsyncHookComp({ id, onLoad }: AsyncProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (id === 'first') {
      return;
    }

    async function load() {
      await runAsyncCall(onLoad);
      setInitialized(true);
    }

    load();
  }, [id, onLoad]);

  return <span>{initialized ? 'Loaded' : 'Loading...'}</span>;
}

export class TimerCdmComp extends React.Component<AsyncProps, AsyncState> {
  state = {
    initialized: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.onLoad();

      this.setState({
        initialized: true,
      });
    }, 100);
  }

  render() {
    return <span>{this.state.initialized ? 'Loaded' : 'Loading...'}</span>;
  }
}

export class TimerCduComp extends React.Component<AsyncProps, AsyncState> {
  state = {
    initialized: false,
  };

  componentDidUpdate(prevProps: AsyncProps) {
    if (this.props.id !== prevProps.id) {
      setTimeout(() => {
        this.props.onLoad();

        this.setState({
          initialized: true,
        });
      }, 100);
    }
  }

  render() {
    return <span>{this.state.initialized ? 'Loaded' : 'Loading...'}</span>;
  }
}

export function TimerHookComp({ id, onLoad }: AsyncProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (id === 'first') {
      return;
    }

    setTimeout(() => {
      onLoad();
      setInitialized(true);
    }, 100);
  }, [id, onLoad]);

  return <span>{initialized ? 'Loaded' : 'Loading...'}</span>;
}
