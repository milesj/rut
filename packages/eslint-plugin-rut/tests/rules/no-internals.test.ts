import rule from '../../src/rules/no-internals';
import { wrapAwait, createRule } from '../helpers';

createRule().run('no-internals', rule, {
  valid: [
    'import { render } from "rut"',
    // Destructure
    'const { debug } = render(<Foo />);',
    'const { unmount, update: rerender } = render(<Foo />);',
    wrapAwait('const { root } = await renderAndWait(<Foo />);'),
    wrapAwait('const { toJSON } = await renderAndWait(<Foo />);'),
    // Variable
    'const result = render(<Foo />); result.debug();',
    'const wrapper = render(<Foo />); wrapper.unmount();',
    wrapAwait('const result = await renderAndWait(<Foo />); await result.updateAndWait({});'),
  ],

  invalid: [
    {
      code: 'import internalApi from "rut/lib/internals/debug";',
      errors: [{ type: 'ImportDeclaration', message: 'Do not import internal Rut APIs.' }],
    },
    // Destructure
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
    // Variable
    {
      code: 'const result = render(<Foo />); result.wrapElement();',
      errors: [{ type: 'MemberExpression', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: 'const wrapper = render(<Foo />); wrapper.element.props.foo;',
      errors: [{ type: 'MemberExpression', message: 'Do not use internal Rut APIs.' }],
    },
    {
      code: wrapAwait('const wrapper = await renderAndWait(<Foo />); wrapper.renderer.toTree();'),
      errors: [{ type: 'MemberExpression', message: 'Do not use internal Rut APIs.' }],
    },
  ],
});
