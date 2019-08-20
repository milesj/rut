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

    expect(render(<TestComp />).root).toContainNode(<span id="foo">Foo</span>);
  });

  it('supports nodes passed through props', () => {
    function TestComp({ children, after }: { children: React.ReactNode; after: React.ReactNode }) {
      return (
        <div>
          <main>{children}</main>
          <aside>
            <section>{after}</section>
          </aside>
        </div>
      );
    }

    const { root } = render(<TestComp after={<div>Bar</div>}>Child</TestComp>);

    expect(root).toContainNode('Child');
    expect(root).toContainNode(<div>Bar</div>);
  });

  describe('immediate', () => {
    it('returns true for a string', () => {
      expect(render(<div>Foo</div>).root).toContainNode('Foo');
    });

    it('returns true for a number', () => {
      expect(render(<div>{123}</div>).root).toContainNode(123);
    });

    it('returns true for a host component node', () => {
      const node = <b>Foo</b>;

      expect(render(<div>{node}</div>).root).toContainNode(node);
    });

    it('returns true for a host component node with props', () => {
      const node = <b id="foo">Foo</b>;

      expect(render(<div>{node}</div>).root).toContainNode(node);
    });

    it('returns true for a function component node', () => {
      const node = <FuncComp />;

      expect(render(<div>{node}</div>).root).toContainNode(node);
    });

    it('returns true for a function component node with props', () => {
      const node = <FuncComp name="func" />;

      expect(render(<div>{node}</div>).root).toContainNode(node);
    });

    it('returns true for a class component node', () => {
      const node = <ClassComp />;

      expect(render(<div>{node}</div>).root).toContainNode(node);
    });

    it('returns true for a class component node with props', () => {
      const node = <ClassComp name="class" />;

      expect(render(<div>{node}</div>).root).toContainNode(node);
    });
  });

  describe('nested', () => {
    it('returns true for a string', () => {
      expect(
        render(
          <div>
            <section>
              <span>
                <b>Foo</b>
              </span>
            </section>
          </div>,
        ).root,
      ).toContainNode('Foo');
    });

    it('returns true for a number', () => {
      expect(
        render(
          <div>
            <section>
              <span>
                <b>{123}</b>
              </span>
            </section>
          </div>,
        ).root,
      ).toContainNode(123);
    });

    it('returns true for a host component node', () => {
      const node = <b>Foo</b>;

      expect(
        render(
          <div>
            <section>{node}</section>
          </div>,
        ).root,
      ).toContainNode(node);
    });

    it('returns true for a host component node with props', () => {
      const node = <b id="foo">Foo</b>;

      expect(
        render(
          <div>
            <button type="button">
              <span>{node}</span>
            </button>
          </div>,
        ).root,
      ).toContainNode(node);
    });

    it('returns true for a function component node', () => {
      const node = <FuncComp />;

      expect(
        render(
          <div>
            <main>{node}</main>
          </div>,
        ).root,
      ).toContainNode(node);
    });

    it('returns true for a function component node with props', () => {
      const node = <FuncComp name="func" />;

      expect(
        render(
          <div>
            <header>
              <div>{node}</div>
            </header>
          </div>,
        ).root,
      ).toContainNode(node);
    });

    it('returns true for a class component node', () => {
      const node = <ClassComp />;

      expect(
        render(
          <div>
            <a href="/">{node}</a>
          </div>,
        ).root,
      ).toContainNode(node);
    });

    it('returns true for a class component node with props', () => {
      const node = <ClassComp name="class" />;

      expect(
        render(
          <div>
            <footer>
              <section>
                <div>{node}</div>
              </section>
            </footer>
          </div>,
        ).root,
      ).toContainNode(node);
    });
  });
});
