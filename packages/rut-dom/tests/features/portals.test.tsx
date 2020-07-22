import React from 'react';
import ReactDOM from 'react-dom';
import { FuncComp } from 'rut/lib/testing/fixtures';
import { render } from '../../src';

const nativeCreatePortal = ReactDOM.createPortal;
const nativeFindNode = ReactDOM.findDOMNode;

describe('Portals', () => {
  class Portal extends React.PureComponent<{ children: NonNullable<React.ReactNode> }> {
    private node?: HTMLDivElement;

    componentWillUnmount() {
      if (this.node) {
        document.body.removeChild(this.node);
        delete this.node;
      }
    }

    render() {
      if (!this.node) {
        this.node = document.createElement('div');
        document.body.append(this.node);
      }

      return ReactDOM.createPortal(this.props.children, this.node);
    }
  }

  // Rut tests don't use JSDOM, so fake this.
  beforeEach(() => {
    global.document = {
      // @ts-ignore
      body: {
        append() {},
      },
      // @ts-ignore
      createElement() {},
      // @ts-ignore
      removeChild() {},
    };
  });

  it('renders the portal element inline', () => {
    const child = <FuncComp />;
    const { root } = render(
      <div>
        <FuncComp />
        <Portal>{child}</Portal>
      </div>,
    );

    expect(root).toContainNode(child);
    expect(root.find(FuncComp)).toHaveLength(2);
  });

  it('sets `react-dom` API back to native', () => {
    expect(ReactDOM.createPortal).toBe(nativeCreatePortal);
    expect(ReactDOM.findDOMNode).toBe(nativeFindNode);

    render(
      <div>
        <Portal>
          <FuncComp />
        </Portal>
      </div>,
    );

    expect(ReactDOM.createPortal).toBe(nativeCreatePortal);
    expect(ReactDOM.findDOMNode).toBe(nativeFindNode);
  });
});
