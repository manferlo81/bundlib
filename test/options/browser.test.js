// @ts-check

const analize = require("../tools/analize");

describe("browser option", () => {

  const cwd = process.cwd();

  test("should throw on invalid browser format option", () => {

    const invalidBrowserFormats = [
      1,
      "string",
    ];

    invalidBrowserFormats.forEach((browser) => {
      expect(analize(cwd, {
        // @ts-ignore
        bundlib: { browser },
      })).rejects.toThrow(TypeError);
    });

  });

  test("should set browser format to iife", async () => {

    const format = "iife";

    const analized = await analize(cwd, {
      bundlib: { browser: format },
    });

    expect(analized.browser.format).toBe(format);

  });

  test("should set browser format to amd", async () => {

    const format = "amd";

    const analized = await analize(cwd, {
      bundlib: { browser: format },
    });

    expect(analized.browser.format).toBe(format);

  });

  test("should set browser format to umd", async () => {

    const format = "umd";

    const analized = await analize(cwd, {
      bundlib: { browser: format },
    });

    expect(analized.browser.format).toBe(format);

  });

  test("should default to umd in no browser format provided", async () => {

    const analized = await analize(cwd, {});

    expect(analized.browser.format).toBe("umd");

  });

});
