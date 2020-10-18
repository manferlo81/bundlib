import analyze from '../tools/analyze';

describe('cache option', () => {

  const cwd = process.cwd();

  const analyzeWithCache = (cache: string) => analyze(cwd, {
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
      void expect(analyzeWithCache(cache as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read cache option', async () => {

    const cacheDir = 'cache-folder';

    const { cache } = await analyzeWithCache(cacheDir);

    expect(cache)
      .toBe(cacheDir);

  });

  test('should be null if cache not provided', async () => {

    const { cache } = await analyze(cwd, {});

    expect(cache)
      .toBeNull();

  });

});
