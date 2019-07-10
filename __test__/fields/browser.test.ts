import analize from "../tools/analize";

describe("package.json browser field", () => {

  const cwd = process.cwd();

  test("should throw on invalid browser field", () => {

    const invalidBrowserPaths = [
      1,
      { name: "value" },
    ];

    invalidBrowserPaths.forEach((browser) => {
      // @ts-ignore
      expect(analize(cwd, { browser })).rejects.toThrow(TypeError);
    });

  });

  test("should read browser field", async () => {

    const analized = await analize(cwd, { browser: "out/lib.js" });

    expect(analized.output.browser ? analized.output.browser.file : null).toMatch(/out[\\/]lib\.js$/);

  });

});
