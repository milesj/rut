import React from 'react';
import render from '../../src/render';
import { FuncComp, ClassComp } from '../fixtures';

describe('toContainNode()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toContainNode('Foo');
    }).toThrowError('Expected a Rut `Element`.');
  });

  it('supports non-referential nodes (shallow equality)', () => {
    function TestComp() {
      return (
        <div>
          <span id="foo">Foo</span>
        </div>
      );
    }

    expect(render(<TestComp />).root()).toContainNode(<span id="foo">Foo</span>);
  });

  it('supports nodes passed through props', () => {
    function TestComp({ children, after }: { children: React.ReactNode; after: React.ReactNode }) {
      return (
        <div>
          {children}
          {after}
        </div>
      );
    }

    const root = render(<TestComp after={<div>Bar</div>}>Child</TestComp>).root();

    expect(root).toContainNode('Child');
    expect(root).toContainNode(<div>Bar</div>);
  });

  describe('immediate', () => {
    it('returns true for a string', () => {
      expect(render(<div>Foo</div>).root()).toContainNode('Foo');
    });

    it('returns true for a number', () => {
      expect(render(<div>123</div>).root()).toContainNode(123);
    });

    it('returns true for a host component node', () => {
      const node = <b>Foo</b>;

      expect(render(<div>{node}</div>).root()).toContainNode(node);
    });

    it('returns true for a host component node with props', () => {
      const node = <b id="foo">Foo</b>;

      expect(render(<div>{node}</div>).root()).toContainNode(node);
    });

    it('returns true for a function component node', () => {
      const node = <FuncComp />;

      expect(render(<div>{node}</div>).root()).toContainNode(node);
    });

    it('returns true for a function component node with props', () => {
      const node = <FuncComp name="func" />;

      expect(render(<div>{node}</div>).root()).toContainNode(node);
    });

    it('returns true for a class component node', () => {
      const node = <ClassComp />;

      expect(render(<div>{node}</div>).root()).toContainNode(node);
    });

    it('returns true for a class component node with props', () => {
      const node = <ClassComp name="class" />;

      expect(render(<div>{node}</div>).root()).toContainNode(node);
    });
  });
});
