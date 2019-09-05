import { mockFetch, unmockFetches } from '../../src/mocks/fetch';

const nativeFetch = () => {};

describe('fetch', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = nativeFetch;
  });

  afterEach(() => {
    unmockFetches();
  });

  describe('mockFetch()', () => {
    it('overrides global', () => {
      const mock = mockFetch('*', 200);

      expect(fetch).not.toBe(nativeFetch);

      mock.restore();

      expect(fetch).toBe(nativeFetch);
    });

    it('matches any route', async () => {
      mockFetch('*', 200);

      const foo = await fetch('/foo');

      expect(foo.status).toBe(200);

      const bar = await fetch('/bar');

      expect(bar.status).toBe(200);
    });

    it('can define multiple routes', async () => {
      mockFetch('/', 200)
        .get('/foo', 201)
        .get('/bar', 301);

      const foo = await fetch('/foo');

      expect(foo.status).toBe(201);

      const bar = await fetch('/bar');

      expect(bar.status).toBe(301);
    });
  });
});
