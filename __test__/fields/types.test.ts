import analize from "../tools/analize";

describe("package.json types", () => {

  const cwd = process.cwd();

  test("should set types to null if no type path provided", async () => {

    const analized = await analize(cwd, {});

    const { types } = analized.output;
    expect(types).toBeNull();

  });

  test("should read types", async () => {

    const analized = await analize(cwd, {
      types: "types/index.d.ts",
    });

    const { types } = analized.output;
    expect(typeof types).toBe("string");

  });

  test("should read typings", async () => {

    const analized = await analize(cwd, {
      typings: "types",
    });

    const { types } = analized.output;
    expect(typeof types).toBe("string");

  });

  test("should read types over typings", async () => {

    const inTypes = "types";

    const analized = await analize(cwd, {
      typings: "typings",
      types: inTypes,
    });

    const { types } = analized.output;
    expect(types).toMatch(new RegExp(`${inTypes}$`));

  });

});
