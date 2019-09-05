import fetchMock, {
  MockMatcher,
  MockResponse,
  MockResponseFunction,
  MockOptions,
} from 'fetch-mock';

export type FetchMockResult = fetchMock.FetchMockStatic;

const instances = new Set<FetchMockResult>();

/**
 * Mock the native `fetch()` with pre-defined responses.
 * Utilizes [fetch-mock](http://www.wheresrhys.co.uk/fetch-mock/) under the hood.
 */
export function mockFetch(
  matcher: MockMatcher,
  response: MockResponse | MockResponseFunction,
  options?: MockOptions,
): FetchMockResult {
  const instance = fetchMock.mock(matcher, response, options);

  instances.add(instance);

  return instance;
}

/**
 * Unmock and restore all fetch instances.
 */
export function unmockFetches() {
  instances.forEach(instance => {
    instance.restore();
  });
}
