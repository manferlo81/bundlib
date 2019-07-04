import analize from "../tools/analize";

describe("package.json main field", () => {

  const cwd = process.cwd();

  test("should read module field", async () => {

    const analized = await analize(cwd, { module: "out/lib.js" });

    expect(analized.output.module).toMatch(/out[\\/]lib\.js$/);

  });

  test("should fallback to jsnext:main field", async () => {

    const analized = await analize(cwd, { "jsnext:main": "out/lib.js" });

    expect(analized.output.module).toMatch(/out[\\/]lib\.js$/);

  });

});
