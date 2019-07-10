import analize from "../tools/analize";

describe("package.json main field", () => {

  const cwd = process.cwd();

  test("should throw on non string main field", () => {

    // @ts-ignore
    expect(analize(cwd, { main: 100 })).rejects.toThrow(TypeError);

  });

  test("should read main field", async () => {

    const analized = await analize(cwd, { main: "out/lib.js" });

    expect(analized.output.main ? analized.output.main.file : null).toMatch(/out[\\/]lib\.js$/);

  });

});
