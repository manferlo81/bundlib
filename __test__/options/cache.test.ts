import { type AllowNullish } from '../../src/api/types/helper-types';
import { mockAnalyzeWithPkg, mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs';

describe('"cache" option', () => {

  const cwd = process.cwd();

  const analyzeWithCacheOption = (cache: AllowNullish<string>) => mockAnalyzeWithPkg(cwd, {
    bundlib: { cache },
  });

  test('Should throw on invalid "cache" option', () => {

    const invalidCacheOptions = [
      1,
      ['string'],
      {},
      true,
    ];

    invalidCacheOptions.forEach((cache) => {
      void expect(analyzeWithCacheOption(cache as never)).rejects.toThrow('Invalid "cache" option');
    });

  });

  test('Should read "cache" option', async () => {

    const cacheDir = 'cache-folder';
    const { cache } = await analyzeWithCacheOption(cacheDir);

    expect(cache).toBe(cacheDir);

  });

  test('Should be null if "cache" option not present', async () => {

    const { cache } = await mockAnalyzeWithPkgEmptyConfig(cwd, {});

    expect(cache).toBeNull();

  });

});
