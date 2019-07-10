import analize from "../tools/analize";

describe("format option", () => {

  const cwd = process.cwd();

  const analizeWithFormat = (format: any) => analize(cwd, {
    browser: "out/lib.js",
    bundlib: { format },
  });

  const analizeWithBuildFormat = (format: any) => analize(cwd, {
    browser: "out/lib.js",
    bundlib: { browser: { format } },
  });

  test("should throw on invalid format option", () => {

    const invalidBrowserFormats = [
      1,
      "string",
    ];

    expect.assertions(invalidBrowserFormats.length);

    invalidBrowserFormats.forEach((format) => {
      expect(
        analizeWithFormat(format),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test("should set browser format to iife", async () => {

    const format = "iife";

    const analized = await analizeWithFormat(format);

    expect(analized.output.browser ? analized.output.browser.format : null)
      .toBe(format);

  });

  test("should set browser format to amd", async () => {

    const format = "amd";

    const analized = await analizeWithFormat(format);

    expect(analized.output.browser ? analized.output.browser.format : null)
      .toBe(format);

  });

  test("should set browser format to umd", async () => {

    const format = "umd";

    const analized = await analizeWithFormat(format);

    expect(analized.output.browser ? analized.output.browser.format : null)
      .toBe(format);

  });

  test("should set browser format to iife from build", async () => {

    const format = "iife";

    const analized = await analizeWithBuildFormat(format);

    expect(analized.output.browser ? analized.output.browser.format : null)
      .toBe(format);

  });

  test("should set browser format to amd from build", async () => {

    const format = "amd";

    const analized = await analizeWithBuildFormat(format);

    expect(analized.output.browser ? analized.output.browser.format : null)
      .toBe(format);

  });

  test("should set browser format to umd from build", async () => {

    const format = "umd";

    const analized = await analizeWithBuildFormat(format);

    expect(analized.output.browser ? analized.output.browser.format : null)
      .toBe(format);

  });

  test("should default to umd in no browser format provided", async () => {

    const analized = await analize(cwd, { browser: "out/lib.js" });

    expect(analized.output.browser ? analized.output.browser.format : null).toBe("umd");

  });

  test("should read build browser format over global one", async () => {

    const analized = await analize(cwd, {
      browser: "out/lib.js",
      bundlib: {
        format: "amd",
        browser: { format: "iife" },
      },
    });

    expect(analized.output.browser ? analized.output.browser.format : null).toBe("iife");

  });

});
