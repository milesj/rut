/* eslint-disable max-classes-per-file, import/no-extraneous-dependencies */

import React from 'react';
import ReactDOM from 'react-dom';

interface TestProps {
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

export const portalElement = ReactDOM.createPortal(<div />, document.createElement('div'));