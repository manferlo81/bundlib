import analize from "../tools/analize";

describe("package.json bin field", () => {

  const cwd = process.cwd();

  test("should throw on invalid bin field", () => {

    const invalidBrowserPaths = [
      1,
      { name: "value" },
    ];

    invalidBrowserPaths.forEach((bin) => {
      // @ts-ignore
      expect(analize(cwd, { bin })).rejects.toThrow(TypeError);
    });

  });

  test("should read binary output filename", async () => {

    const analized = await analize(cwd, { bin: "bin/cli.js" });

    expect(analized.output.bin).toMatch(/bin[\\/]cli\.js$/);

  });

});
