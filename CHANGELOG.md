# Changelog

- [eslint-plugin-rut](./packages/eslint-plugin-rut/CHANGELOG.md)
- [jest-rut](./packages/jest-rut/CHANGELOG.md)
- [rut](./packages/rut/CHANGELOG.md)
- [rut-dom](./packages/rut-dom/CHANGELOG.md)

## `rut` v0.9.0

To better support `react-dom`, `react-native`, and another renderers, the `rut` package was
repurposed to provide "core" functionality to be adapted and expanded upon. Because of this, a new
`rut-dom` package has been added that should be used for testing DOM based components instead of
`rut` itself.

To migrate, run the following commands.

```
yarn remove rut
yarn add rut-dom
```

Then find and change all `rut` imports to `rut-dom`.
