/* eslint-disable rut/no-internals */

import React from 'react';
import { render } from '../../src/render';
import { NodeType } from '../../src/types';
import toBeNodeType from '../../src/matchers/toBeNodeType';
import { runMatcher } from '../helpers';
import { FuncComp, ClassComp, ForwardRefComp, MemoComp } from '../fixtures';
import Element from '../../src/Element';

describe.skip('toBeNodeType()', () => {
  it('errors if a non-Element is passed', () => {
    expect(() => {
      expect(123).toBeNodeType('function-component');
    }).toThrowError('Expected a Rut `Element`.');
  });

  it('errors if an invalid node type', () => {
    expect(async () => {
      expect((await render(<div />)).root).toBeNodeType(
        // @ts-ignore Allow invalid
        'unknown-type',
      );
    }).toThrowErrorMatchingSnapshot();

    expect(async () => {
      runMatcher(
        toBeNodeType(
          (await render(<div />)).root,
          // @ts-ignore Allow invalid
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

  // eslint-disable-next-line
  Object.entries(nodeTypes).forEach(async ([testTypeName, testNode]) => {
    const expectedNode = new Element(
      // @ts-ignore
      (await render(<div>{testNode}</div>)).root.element.children[0],
    );
    const typeName = testTypeName as NodeType;

    if (typeof expectedNode === 'string') {
      return;
    }

    describe(`"${typeName}" type`, () => {
      it('passes when types match', () => {
        expect(() => {
          runMatcher(toBeNodeType(expectedNode, typeName));
        }).not.toThrowError();
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
        }).not.toThrowError();
      });

      it('errors when types dont match (not negation)', () => {
        expect(() => {
          runMatcher(toBeNodeType(expectedNode, typeName), true);
        }).toThrowErrorMatchingSnapshot();
      });
    });
  });
});
