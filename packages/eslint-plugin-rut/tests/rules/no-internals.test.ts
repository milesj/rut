import rule from '../../src/rules/no-internals';
import { wrapAwait, createRule } from '../helpers';

createRule().run('no-internals', rule, {
  valid: [
    'import { render } from "rut"',
    'import { FuncComp } from "rut/lib/testing/fixtures"',
    // Result destructure
    'const { debug } = render(<Foo />);',
    'const { unmount, update: rerender } = render(<Foo />);',
    wrapAwait('const { root } = await renderAndWait(<Foo />);'),
    wrapAwait('const { toJSON } = await renderAndWait(<Foo />);'),
    // Result variable
    'const result = render(<Foo />); result.debug();',
    'const wrapper = render(<Foo />); wrapper.unmount();',
    wrapAwait('const result = await renderAndWait(<Foo />); await result.updateAndWait({});'),
    // Element
    'const result = render(<Foo />); result.findOne().dispatch()',
  ],

  invalid: [
    {
      code: 'import internalApi from "rut/lib/internals/debug";',
      errors: [{ type: 'ImportDeclaration', message: 'Do not import internal Rut APIs.' }],
    },
    // Result destructure
    {
      code: 'const { isRutResult } = render(<Foo />);',
      errors: [{ type: 'Property', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: 'const { element: renamed } = render(<Foo />);',
      errors: [{ type: 'Property', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: 'const { renderer } = render(<Foo />);',
      errors: [{ type: 'Property', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: wrapAwait('const { options } = await renderAndWait(<Foo />);'),
      errors: [{ type: 'Property', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: wrapAwait('const { updateElement } = await renderAndWait(<Foo />);'),
      errors: [{ type: 'Property', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: wrapAwait('const { wrapElement } = await renderAndWait(<Foo />);'),
      errors: [{ type: 'Property', message: 'Do not use internal Rut APIs.' }],
    },
    // Result variable
    {
      code: 'const result = render(<Foo />); result.wrapElement();',
      errors: [{ type: 'MemberExpression', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: 'const wrapper = render(<Foo />); wrapper.element.props.foo;',
      errors: [
        { type: 'MemberExpression', message: 'Do not use internal Rut APIs.' },
        { type: 'Identifier', message: 'Do not use internal Rut APIs.' },
      ],
    },
    {
      code: wrapAwait('const wrapper = await renderAndWait(<Foo />); wrapper.renderer.toTree();'),
      errors: [{ type: 'MemberExpression', message: 'Do not use internal Rut APIs.' }],
    },
    // Element
    {
      code: 'const { root } = render(<Foo />); root.isRutElement;',
      errors: [{ type: 'Identifier', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: 'const { root } = render(<Foo />); root.element.props;',
      errors: [{ type: 'Identifier', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: 'const { root } = render(<Foo />); root.element._fiber;',
      errors: [{ type: 'Identifier', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: 'const { root } = render(<Foo />); root.element.findAll();',
      errors: [{ type: 'Identifier', message: 'Do not use internal Rut APIs.' }],
    },
  ],
});
