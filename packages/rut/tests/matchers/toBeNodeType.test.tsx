/* eslint-disable rut/no-internals */

import React from 'react';
import Element from '../../src/Element';
import toBeNodeType from '../../src/matchers/toBeNodeType';
import { ClassComp, ForwardRefComp, FuncComp, MemoComp } from '../../src/testing/fixtures';
import { render, runMatcher } from '../../src/testing/helpers';
import { NodeType } from '../../src/types';

describe('toBeNodeType()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toBeNodeType('function-component');
    }).toThrow('Expected a Rut `Element`.');
  });

  it('errors if an invalid node type', () => {
    expect(() => {
      expect(render(<div />).root).toBeNodeType(
        // @ts-expect-error Allow invalid
        'unknown-type',
      );
    }).toThrowErrorMatchingSnapshot();

    expect(() => {
      runMatcher(
        toBeNodeType(
          render(<div />).root,
          // @ts-expect-error Allow invalid
          'unknown-type',
        ),
      );
    }).toThrowErrorMatchingSnapshot();
  });

  const nodeTypes = {
    'class-component': <ClassComp />,
    'forward-ref': <ForwardRefComp />,
    'function-component': <FuncComp />,
    'host-component': <div />,
    memo: <MemoComp />,
  };

  Object.entries(nodeTypes).forEach(([testTypeName, testNode]) => {
    // @ts-expect-error
    const expectedNode = new Element(render(<div>{testNode}</div>).root.element.children[0]);
    const typeName = testTypeName as NodeType;

    if (typeof expectedNode === 'string') {
      return;
    }

    describe(`"${typeName}" type`, () => {
      it('passes when types match', () => {
        expect(() => {
          runMatcher(toBeNodeType(expectedNode, typeName));
        }).not.toThrow();
      });

      it('errors when types dont match', () => {
        expect(() => {
          runMatcher(
            toBeNodeType(
              expectedNode,
              typeName === 'function-component' ? 'class-component' : 'function-component',
            ),
          );
        }).toThrowErrorMatchingSnapshot();
      });

      it('passes when types match (not negation)', () => {
        expect(() => {
          runMatcher(
            toBeNodeType(
              expectedNode,
              typeName === 'function-component' ? 'class-component' : 'function-component',
            ),
            true,
          );
        }).not.toThrow();
      });

      it('errors when types dont match (not negation)', () => {
        expect(() => {
          runMatcher(toBeNodeType(expectedNode, typeName), true);
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
