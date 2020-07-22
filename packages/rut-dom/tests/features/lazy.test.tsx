import React from 'react';
import { render } from '../../src';

// Not supported by RTR: https://github.com/facebook/react/issues/14170
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Lazy', () => {
  // @ts-expect-error
  const Comp = React.lazy(() => import('./__mocks__/Lazy'));

  it('renders an imported lazy component', () => {
    const result = render(
      <React.Suspense fallback="Loading...">
        <main>
          <Comp />
        </main>
      </React.Suspense>,
    );

    expect(result.root).toContainNode('Lazy loaded!');
  });
});
