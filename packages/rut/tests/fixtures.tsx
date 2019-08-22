/* eslint-disable max-classes-per-file */

import React, { useState, useEffect } from 'react';
import { runAsyncCall } from './helpers';

export interface TestProps {
  name?: string;
}

export function FuncComp(props: TestProps) {
  return <span />;
}

export function FuncCompWithDisplayName() {
  return <span />;
}

FuncCompWithDisplayName.displayName = 'CustomFuncName';

export class ClassComp extends React.Component<TestProps> {
  render() {
    return <div />;
  }
}

export class ClassCompWithDisplayName extends React.Component {
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

export class AsyncCdmComp extends React.Component<AsyncProps, { initialized: boolean }> {
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

export class AsyncCduComp extends React.Component<AsyncProps, { initialized: boolean }> {
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
    runAsyncCall(onLoad)
      .then(result => {
        setInitialized(true);

        return result;
      })
      .catch(() => {});
  }, [id, onLoad]);

  return <span>{initialized ? 'Loaded' : 'Loading...'}</span>;
}
