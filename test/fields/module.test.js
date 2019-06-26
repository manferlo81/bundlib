// @ts-check

const analize = require("../tools/analize");

describe("package.json main field", () => {

  const cwd = process.cwd();

  test("should read module field", async () => {

    const analized = await analize(cwd, { module: "out/lib.js" });

    expect(analized.output.module).toMatch(/out[\\/]lib\.js$/);

  });

});
