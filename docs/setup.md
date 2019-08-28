# Setup

Begin by installing the `rut` package as a dev dependency. Since this is a React testing library, be
sure `react` is also installed.

```bash
yarn add --dev rut
```

And that's it! Head over to the [API](./api.md) for more information on how to use `render()`,
`renderAndWait()`, and others -- or continue reading for testing framework specific functionality.

## Framework Integrations

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
