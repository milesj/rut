import React, { Suspense, Profiler } from 'react';
// import ReactDOM from 'react-dom';
import render from '../src/render';
import { NodeType } from '../lib/types';

describe('matchers', () => {
  function MismatchComp() {
    return null;
  }

  function FuncComp() {
    return null;
  }

  class ClassComp extends React.Component {
    render() {
      return null;
    }
  }

  const ForwardRefComp = React.forwardRef(FuncComp);
  const MemoComp = React.memo(FuncComp);

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
          expect(render(<FuncComp />).root()).toBeElementType(MismatchComp);
        }).toThrowError('expected `FuncComp` to be a `MismatchComp`');
      });

      it('passes when types match (not negation)', () => {
        expect(() => {
          expect(render(<FuncComp />).root()).not.toBeElementType(MismatchComp);
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
          expect(render(<ClassComp />).root()).toBeElementType(MismatchComp);
        }).toThrowError('expected `ClassComp` to be a `MismatchComp`');
      });

      it('passes when types match (not negation)', () => {
        expect(() => {
          expect(render(<ClassComp />).root()).not.toBeElementType(MismatchComp);
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

    const nodeTypeMap = {
      'class-component': <ClassComp />,
      // 'context-consumer': <Ctx.Consumer>{() => null}</Ctx.Consumer>,
      // 'context-provider': <Ctx.Provider value="test">{null}</Ctx.Provider>,
      'forward-ref': <ForwardRefComp />,
      fragment: (
        <>
          <div />
        </>
      ),
      'function-component': <FuncComp />,
      'host-component': <div />,
      lazy: React.lazy(() => Promise.resolve({ default: FuncComp })),
      memo: <MemoComp />,
      // mode: 8,
      //      portal: ReactDOM.createPortal(<div />),
      profiler: <Profiler id="test" onRender={jest.fn()} />,
      // root: 3,
      suspense: <Suspense fallback={<div />} />,
      text: 'test',
    };

    Object.entries(nodeTypeMap).forEach(([testTypeName, testNode]) => {
      const wrapper = render(<div>{testNode}</div>);
      const expectedNode = wrapper.root().children()[0];
      const typeName = testTypeName as NodeType;

      describe(`${typeName} type`, () => {
        it('passes when types match', () => {
          expect(() => {
            expect(expectedNode).toBeNodeType(typeName);
          }).not.toThrowError();
        });

        it('errors when types dont match', () => {
          expect(() => {
            expect(expectedNode).toBeNodeType(typeName === 'root' ? 'mode' : 'root');
          }).toThrowErrorMatchingSnapshot();
        });

        it('passes when types match (not negation)', () => {
          expect(() => {
            expect(expectedNode).not.toBeNodeType(typeName === 'root' ? 'mode' : 'root');
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
