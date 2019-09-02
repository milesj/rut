import { RuleTester } from 'eslint';
import rule from '../../src/rules/no-act';

const NONE_ACT_CODE = 'const result = render(<Foo />);';

new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
}).run('no-act', rule, {
  valid: [NONE_ACT_CODE],

  invalid: [
    {
      code: `act(() => { ${NONE_ACT_CODE} });`,
      errors: [{ message: 'Use `render()`, `update()`, or `emit()` instead of `act()`.' }],
    },
    {
      code: `(async () => await act(async () => { ${NONE_ACT_CODE} }))();`,
      errors: [
        {
          message:
            'Use `await renderAndWait()`, `await updateAndWait()`, or `await emitAndWait()` instead of `await act()`.',
        },
      ],
    },
  ],
});
