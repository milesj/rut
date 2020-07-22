import { mockFetch, unmockFetches } from '../../src/mocks/fetch';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      fetch: typeof fetch;
    }
  }
}

const nativeFetch = () => Promise.resolve({} as Response);

describe('mockFetch()', () => {
  beforeEach(() => {
    global.fetch = nativeFetch;
  });

  afterEach(() => {
    unmockFetches();
  });

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
    mockFetch('/', 200).get('/foo', 201).get('/bar', 301);

    const foo = await fetch('/foo');

    expect(foo.status).toBe(201);

    const bar = await fetch('/bar');

    expect(bar.status).toBe(301);
  });

  it('can spy on it using `spyOn`', async () => {
    mockFetch('/', 200).get('/foo', 201).post('/bar', 301);

    const spy = jest.spyOn(global, 'fetch');

    await fetch('/foo');
    await fetch('/bar', { method: 'POST' });

    expect(spy).toHaveBeenCalledWith('/foo');
    expect(spy).toHaveBeenCalledWith('/bar', { method: 'POST' });
  });
});
