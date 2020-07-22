/* eslint-disable no-console */

// React logs errors to the console when an error is thrown,
// even when a boundary exists. Silence it temporarily.
// https://github.com/facebook/react/issues/15520
const nativeConsoleError = console.error.bind(console);
const silencedErrors = [/^The above error occurred in the <\w+> component:/u];

export function patchConsoleErrors(): () => void {
  console.error = (message: string) => {
    const silence = silencedErrors.some((pattern) => pattern.test(message));

    if (!silence) {
      nativeConsoleError(message);
    }
  };

  return () => {
    console.error = nativeConsoleError;
  };
}
