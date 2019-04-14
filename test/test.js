const { analizePkg } = require("..");

const cwd = process.cwd();

describe("analize", () => {

  test("should analize package.json", async () => {

    const json = {
      main: "test/output.js",
    };

    const analized = await analizePkg(cwd, json);

    expect(typeof analized).toBe("object");
    expect(analized).toHaveProperty("cwd");
    expect(analized).toHaveProperty("pkg");
    expect(analized).toHaveProperty("external");
    expect(analized).toHaveProperty("types");
    expect(analized).toHaveProperty("options");

    const { cwd: analizedCWD, pkg, external, types, options } = analized;

    expect(analizedCWD).toBe(cwd);
    expect(pkg).toBe(json);
    expect(external).toHaveProperty("length");
    expect(types).toBeNull();
    expect(typeof options).toBe("object");
    expect(options).toHaveProperty("input");
    expect(options).toHaveProperty("sourcemap");
    expect(options).toHaveProperty("esModule");
    expect(options).toHaveProperty("interop");

  });

});
