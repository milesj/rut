# Setup

Begin by installing the `rut` package as a dev dependency. Since this is a React testing library, be
sure `react` is also installed.

```bash
yarn add --dev rut
```

And that's it! Head over to the [API](./api.md) for more information on how to use `render()`,
`renderAndWait()`, and others -- or continue reading for testing framework specific functionality.

## Test Integrations

Rut provides a handful of [matchers](./matchers.md) and snapshot serializers (framework dependent)
for expecting and asserting common patterns. To make use of these, follow the instructions for your
chosen testing framework.

### Jest

Install the `jest-rut` package as a dev dependency.

```bash
yarn add --dev jest-rut
```

Once installed, add `jest-rut` to `setupFilesAfterEnv` in your `jest.config.js` file.

```js
module.exports = {
  setupFilesAfterEnv: ['jest-rut'],
};
```

This will automatically register the snapshot serializer and all matchers. No need to import within
your test files.

## Lint Integrations

Rut also provides custom linting rules to enforce best testing practices.

### ESLint

Install the `eslint-plugin-rut` package as a dev dependency.

```bash
yarn add --dev eslint-plugin-rut
```

Once installed, add the recommended config to your `.eslintrc.js` file. It's highly encouraged to
only apply these rules to test files, otherwise your source files may trigger false positives, so
use overrides!

```js
module.exports = {
  overrides: [
    {
      files: ['*.test.ts', '*.test.js'],
      plugins: ['rut'],
      rules: {
        'rut/no-act': 'error',
      },
    },
  ],
};
```

If you don't mind targeting everything, you can extend the recommended preset.

```js
module.exports = {
  extends: ['plugin:rut/recommended'],
};
```

[View list of available rules!](./setup/rules.md)
