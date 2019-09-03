import { RuleTester } from 'eslint';

export function createRule(): RuleTester {
  return new RuleTester({
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2018,
      sourceType: 'module',
    },
  });
}

export function wrapAwait(source: string): string {
  return `(async () => { ${source} })();`;
}
