import rule from '../../src/rules/require-render-generics';
import { createRule } from '../helpers';

createRule().run('require-render-generics', rule, {
  valid: [
    'render<FooProps>(<Foo />)',
    'renderAndWait<FooProps>(<Foo />)',
    'render(<div />)',
    'renderAndWait(<main />)',
  ],

  invalid: [
    {
      code: `render(<Foo />)`,
      errors: [
        {
          type: 'CallExpression',
          message: 'Render is missing the `Foo` props type generic.',
        },
      ],
    },
    {
      code: 'renderAndWait(<Foo />)',
      errors: [
        {
          type: 'CallExpression',
          message: 'Render is missing the `Foo` props type generic.',
        },
      ],
    },
  ],
});
