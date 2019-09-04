import analize from "../tools/analize";

describe("bin option", () => {

  const cwd = process.cwd();

  const analizeWithBin = (bin: any) => analize(cwd, {
    bin: "out.js",
    bundlib: { bin },
  });

  test("should throw on invalid bin option", () => {

    const invalidInputs = [
      1,
      true,
      { invalid: 100 },
    ];

    expect.assertions(invalidInputs.length);

    invalidInputs.forEach((bin) => {
      expect(
        analizeWithBin(bin),
      ).rejects
        .toThrow(TypeError);
    });

  });

  test("should read legacy binary input file bin option", async () => {

    const { input: { bin } } = await analizeWithBin("src-bin/main.ts");

    expect(bin)
      .toMatch(/src-bin[/\\]main\.ts$/);

  });

  test("should prevent Binary module build if bin = false", async () => {

    const { output: { bin } } = await analizeWithBin(false);

    expect(bin)
      .toBeNull();

  });

});
