import { configure, globalOptions } from '../src/configure';

describe('configure()', () => {
  afterEach(() => {
    delete globalOptions.strict;
  });

  it('sets global options', () => {
    expect(globalOptions.strict).toBeUndefined();

    configure({ strict: true });

    expect(globalOptions.strict).toBe(true);
  });
});
