import analize from "../tools/analize";

describe("package.json main field", () => {

  const cwd = process.cwd();

  const analizeWithMain = (main: any) => analize(cwd, { main });

  test("should throw on non string main field", () => {

    const invalidMainFields = [
      1,
      { name: "value" },
    ];

    expect.assertions(invalidMainFields.length);

    invalidMainFields.forEach((main) => {

      expect(
        analizeWithMain(main),
      ).rejects
        .toThrow(TypeError);

    });

  });

  test("should read main field", async () => {

    const analized = await analizeWithMain("out/lib.js");
    const { main } = analized.output;

    expect(main ? main.path : null)
      .toMatch(/out[\\/]lib\.js$/);

  });

});
