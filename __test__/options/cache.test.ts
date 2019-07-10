import analize from "../tools/analize";

describe("cache option", () => {

  const cwd = process.cwd();

  const analizeWithCache = (cache: any) => analize(cwd, {
    bundlib: { cache },
  });

  test("should throw on invalid cache option", () => {

    const invalidCacheOptions = [
      1,
      ["string"],
      {},
      true,
    ];

    expect.assertions(invalidCacheOptions.length);

    invalidCacheOptions.forEach((cache) => {
      expect(
        analizeWithCache(cache),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test("should read cache option", async () => {

    const cache = "cache-folder";

    const analized = await analizeWithCache(cache);

    expect(analized.cache).toMatch(new RegExp("[/\\\\]" + cache + "$"));

  });

  test("should default if cache not provided", async () => {

    const analized = await analize(cwd, {});

    expect(analized.cache).toMatch(/[/\\]\.cache[/\\]bundlib$/);

  });

});
