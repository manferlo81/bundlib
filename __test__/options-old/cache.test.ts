import analize from '../tools/analize';

describe('cache option', () => {

  const cwd = process.cwd();

  const analizeWithCache = (cache: string) => analize(cwd, {
    bundlib: { cache },
  });

  test('should throw on invalid cache option', () => {

    const invalidCacheOptions = [
      1,
      ['string'],
      {},
      true,
    ];

    expect.assertions(invalidCacheOptions.length);

    invalidCacheOptions.forEach((cache) => {
      void expect(analizeWithCache(cache as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read cache option', async () => {

    const cacheDir = 'cache-folder';

    const { cache } = await analizeWithCache(cacheDir);

    expect(cache)
      .toBe(cacheDir);

  });

  test('should be null if cache not provided', async () => {

    const { cache } = await analize(cwd, {});

    expect(cache)
      .toBeNull();

  });

});
