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

  describe('toRenderChildren()', () => {
    function NullRender() {
      return null;
    }

    function FalseRender() {
      return false;
    }

    function HostCompRender() {
      return <div />;
    }

    function FuncCompRender() {
      return <FuncComp />;
    }

    function ClassCompRender() {
      return <ClassComp />;
    }

    function FragmentRender() {
      return <>Content</>;
    }

    function StringRender() {
      return 'Content';
    }

    function ArrayRender() {
      return ['Content', <span key="span" />];
    }

    function NestedNullRender() {
      return <NullRender />;
    }

    it('errors if a non-Element is passed', () => {
      expect(() => {
        expect(123).toRenderChildren();
      }).toThrowError('toRenderChildren: Expected a Rut `Element`.');
    });

    it('returns false if null was returned', () => {
      expect(render(<NullRender />).root()).not.toRenderChildren();
    });

    it('returns false if false was returned', () => {
      // @ts-ignore
      expect(render(<FalseRender />).root()).not.toRenderChildren();
    });

    it('returns true if a host component was rendered', () => {
      expect(render(<HostCompRender />).root()).toRenderChildren();
    });

    it('returns true if a function component was rendered', () => {
      expect(render(<FuncCompRender />).root()).toRenderChildren();
    });

    it('returns true if a class component was rendered', () => {
      expect(render(<ClassCompRender />).root()).toRenderChildren();
    });

    it('returns true if a fragment was rendered', () => {
      expect(render(<FragmentRender />).root()).toRenderChildren();
    });

    it('returns true if a string was rendered', () => {
      // @ts-ignore
      expect(render(<StringRender />).root()).toRenderChildren();
    });

    it('returns true if an array of nodes was rendered', () => {
      // @ts-ignore
      expect(render(<ArrayRender />).root()).toRenderChildren();
    });

    it('returns true if a child component that rendered null was rendered', () => {
      expect(render(<NestedNullRender />).root()).toRenderChildren();
    });
  });
});
