/* eslint-disable jest/expect-expect */

import React from 'react';
import { render } from '../../src/render';
import toContainNode from '../../src/matchers/toContainNode';
import { runMatcher } from '../helpers';
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

    runMatcher(toContainNode(render<{}>(<TestComp />).root, <span id="foo">Foo</span>));
  });

  it('doesnt support partial matching props', () => {
    function TestComp() {
      return (
        <div>
          <span id="foo" className="foo">
            Foo
          </span>
        </div>
      );
    }

    expect(() => {
      runMatcher(toContainNode(render<{}>(<TestComp />).root, <span id="foo">Foo</span>));
    }).toThrowError('expected <TestComp /> to contain node <span id="foo" />');
  });

  it('supports nodes passed through props', () => {
    interface TestCompProps {
      children: React.ReactNode;
      after: React.ReactNode;
    }

    function TestComp({ children, after }: TestCompProps) {
      return (
        <div>
          <main>{children}</main>
          <aside>
            <section>{after}</section>
          </aside>
        </div>
      );
    }

    const { root } = render<TestCompProps>(<TestComp after={<div>Bar</div>}>Child</TestComp>);

    runMatcher(toContainNode(root, 'Child'));
    runMatcher(toContainNode(root, <div>Bar</div>));
  });

  describe('immediate', () => {
    it('returns true for a string', () => {
      runMatcher(toContainNode(render(<div>Foo</div>).root, 'Foo'));
    });

    it('returns true for a number', () => {
      runMatcher(toContainNode(render(<div>{123}</div>).root, 123));
    });

    it('returns true for a host component node', () => {
      const node = <b>Foo</b>;

      runMatcher(toContainNode(render(<div>{node}</div>).root, node));
    });

    it('returns true for a host component node with props', () => {
      const node = <b id="foo">Foo</b>;

      runMatcher(toContainNode(render(<div>{node}</div>).root, node));
    });

    it('returns true for a function component node', () => {
      const node = <FuncComp />;

      runMatcher(toContainNode(render(<div>{node}</div>).root, node));
    });

    it('returns true for a function component node with props', () => {
      const node = <FuncComp name="func" />;

      runMatcher(toContainNode(render(<div>{node}</div>).root, node));
    });

    it('returns true for a class component node', () => {
      const node = <ClassComp />;

      runMatcher(toContainNode(render(<div>{node}</div>).root, node));
    });

    it('returns true for a class component node with props', () => {
      const node = <ClassComp name="class" />;

      runMatcher(toContainNode(render(<div>{node}</div>).root, node));
    });
  });

  describe('nested', () => {
    it('returns true for a string', () => {
      runMatcher(
        toContainNode(
          render(
            <div>
              <section>
                <span>
                  <b>Foo</b>
                </span>
              </section>
            </div>,
          ).root,
          'Foo',
        ),
      );
    });

    it('returns true for a number', () => {
      runMatcher(
        toContainNode(
          render(
            <div>
              <section>
                <span>
                  <b>{123}</b>
                </span>
              </section>
            </div>,
          ).root,
          123,
        ),
      );
    });

    it('returns true for a host component node', () => {
      const node = <b>Foo</b>;

      runMatcher(
        toContainNode(
          render(
            <div>
              <section>{node}</section>
            </div>,
          ).root,
          node,
        ),
      );
    });

    it('returns true for a host component node with props', () => {
      const node = <b id="foo">Foo</b>;

      runMatcher(
        toContainNode(
          render(
            <div>
              <button type="button">
                <span>{node}</span>
              </button>
            </div>,
          ).root,
          node,
        ),
      );
    });

    it('returns true for a function component node', () => {
      const node = <FuncComp />;

      runMatcher(
        toContainNode(
          render(
            <div>
              <main>{node}</main>
            </div>,
          ).root,
          node,
        ),
      );
    });

    it('returns true for a function component node with props', () => {
      const node = <FuncComp name="func" />;

      runMatcher(
        toContainNode(
          render(
            <div>
              <header>
                <div>{node}</div>
              </header>
            </div>,
          ).root,
          node,
        ),
      );
    });

    it('returns true for a class component node', () => {
      const node = <ClassComp />;

      runMatcher(
        toContainNode(
          render(
            <div>
              <a href="/">{node}</a>
            </div>,
          ).root,
          node,
        ),
      );
    });

    it('returns true for a class component node with props', () => {
      const node = <ClassComp name="class" />;

      runMatcher(
        toContainNode(
          render(
            <div>
              <footer>
                <section>
                  <div>{node}</div>
                </section>
              </footer>
            </div>,
          ).root,
          node,
        ),
      );
    });
  });
});
