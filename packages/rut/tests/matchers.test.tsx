import React from 'react';
import render from '../src/render';
import { NodeType } from '../src/types';
import {
  FuncComp,
  FuncCompWithDisplayName,
  ClassComp,
  ClassCompWithDisplayName,
  ForwardRefComp,
  MemoComp,
} from './fixtures';

describe('matchers', () => {
  describe('toBeElementType()', () => {
    it('errors if a non-Element is passed', () => {
      expect(() => {
        expect(123).toBeElementType('div');
      }).toThrowError('toBeElementType: Expected a Rut `Element`.');
    });

    describe('host components', () => {
      it('passes when types match', () => {
        expect(() => {
          expect(render(<div />).root()).toBeElementType('div');
        }).not.toThrowError();
      });

      it('errors when types dont match', () => {
        expect(() => {
          expect(render(<div />).root()).toBeElementType('span');
        }).toThrowError('expected `div` to be a `span`');
      });

      it('passes when types match (not negation)', () => {
        expect(() => {
          expect(render(<div />).root()).not.toBeElementType('span');
        }).not.toThrowError();
      });

      it('errors when types dont match (not negation)', () => {
        expect(() => {
          expect(render(<div />).root()).not.toBeElementType('div');
        }).toThrowError('expected `div` not to be a `div`');
      });
    });

    describe('function components', () => {
      it('passes when types match', () => {
        expect(() => {
          expect(render(<FuncComp />).root()).toBeElementType(FuncComp);
        }).not.toThrowError();
      });

      it('errors when types dont match', () => {
        expect(() => {
          expect(render(<FuncComp />).root()).toBeElementType(FuncCompWithDisplayName);
        }).toThrowError('expected `FuncComp` to be a `CustomFuncName`');
      });

      it('passes when types match (not negation)', () => {
        expect(() => {
          expect(render(<FuncComp />).root()).not.toBeElementType(FuncCompWithDisplayName);
        }).not.toThrowError();
      });

      it('errors when types dont match (not negation)', () => {
        expect(() => {
          expect(render(<FuncComp />).root()).not.toBeElementType(FuncComp);
        }).toThrowError('expected `FuncComp` not to be a `FuncComp`');
      });
    });

    describe('class components', () => {
      it('passes when types match', () => {
        expect(() => {
          expect(render(<ClassComp />).root()).toBeElementType(ClassComp);
        }).not.toThrowError();
      });

      it('errors when types dont match', () => {
        expect(() => {
          expect(render(<ClassComp />).root()).toBeElementType(ClassCompWithDisplayName);
        }).toThrowError('expected `ClassComp` to be a `CustomCompName`');
      });

      it('passes when types match (not negation)', () => {
        expect(() => {
          expect(render(<ClassComp />).root()).not.toBeElementType(ClassCompWithDisplayName);
        }).not.toThrowError();
      });

      it('errors when types dont match (not negation)', () => {
        expect(() => {
          expect(render(<ClassComp />).root()).not.toBeElementType(ClassComp);
        }).toThrowError('expected `ClassComp` not to be a `ClassComp`');
      });
    });
  });

  describe('toBeNodeType()', () => {
    it('errors if a non-Element is passed', () => {
      expect(() => {
        expect(123).toBeNodeType('function-component');
      }).toThrowError('toBeNodeType: Expected a Rut `Element`.');
    });

    it('errors if an invalid node type', () => {
      expect(() => {
        expect(render(<div />).root()).toBeNodeType(
          // @ts-ignore Allow invalid
          'unknown-type',
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
      const expectedNode = render(<div>{testNode}</div>)
        .root()
        .children()[0];
      const typeName = testTypeName as NodeType;

      describe(`"${typeName}" type`, () => {
        it('passes when types match', () => {
          expect(() => {
            expect(expectedNode).toBeNodeType(typeName);
          }).not.toThrowError();
        });

        it('errors when types dont match', () => {
          expect(() => {
            expect(expectedNode).toBeNodeType(
              typeName === 'function-component' ? 'class-component' : 'function-component',
            );
          }).toThrowErrorMatchingSnapshot();
        });

        it('passes when types match (not negation)', () => {
          expect(() => {
            expect(expectedNode).not.toBeNodeType(
              typeName === 'function-component' ? 'class-component' : 'function-component',
            );
          }).not.toThrowError();
        });

        it('errors when types dont match (not negation)', () => {
          expect(() => {
            expect(expectedNode).not.toBeNodeType(typeName);
          }).toThrowErrorMatchingSnapshot();
        });
      });
    });
  });
});
