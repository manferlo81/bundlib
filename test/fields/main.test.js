// @ts-check

const analize = require("../tools/analize");

describe("package.json main field", () => {

  const cwd = process.cwd();

  test("should read main field", async () => {

    const analized = await analize(cwd, { main: "out/lib.js" });

    expect(analized.output.main).toMatch(/out[\\/]lib\.js$/);

  });

});
