import rule from '../../src/rules/no-act';
import { createRule, wrapAwait } from '../helpers';

const NON_ACT_CODE = 'const result = render(<Foo />);';

createRule().run('no-act', rule, {
  valid: [NON_ACT_CODE],

  invalid: [
    {
      code: `act(() => { ${NON_ACT_CODE} });`,
      errors: [
        {
          type: 'CallExpression',
          message: 'Use `render()`, `update()`, or `dispatch()` instead of `act()`.',
        },
      ],
    },
    {
      code: wrapAwait(`await act(async () => { ${NON_ACT_CODE} });`),
      errors: [
        {
          type: 'CallExpression',
          message:
            'Use `await renderAndWait()`, `await updateAndWait()`, or `await dispatchAndWait()` instead of `await act()`.',
        },
      ],
    },
  ],
});
