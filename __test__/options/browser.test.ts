import analize from "../tools/analize";

describe("browser option", () => {

  const cwd = process.cwd();

  const analizeWithBrowser = (browser: any) => analize(cwd, {
    browser: "out.js",
    bundlib: { browser },
  });

  test("should throw on invalid browser option", () => {

    const invalidBrowser = [
      1,
      true,
      { invalid: true },
      { format: "fmt" },
      { name: 1 },
      { id: 1 },
      { globals: "invalid" },
    ];

    expect.assertions(invalidBrowser.length);

    invalidBrowser.forEach((browser) => {
      expect(
        analizeWithBrowser(browser),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test("should prevent Browser module build if browser = false", async () => {

    const analized = await analizeWithBrowser(false);

    expect(analized.output.browser)
      .toBeNull();

  });

});
