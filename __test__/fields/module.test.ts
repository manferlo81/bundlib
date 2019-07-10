import { ESModuleBuildInfo } from "../../src/api/pkg-analized";
import analize from "../tools/analize";

describe("package.json main field", () => {

  const cwd = process.cwd();

  test("should throw on non string module field", () => {

    // @ts-ignore
    expect(analize(cwd, { module: 100 })).rejects.toThrow(TypeError);

  });

  test("should throw on non string jsnext:main field", () => {

    // @ts-ignore
    expect(analize(cwd, { "jsnext:main": 100 })).rejects.toThrow(TypeError);

  });

  test("should read module field", async () => {

    const analized = await analize(cwd, { module: "out/lib.js" });

    expect((analized.output.module as ESModuleBuildInfo).file).toMatch(/out[\\/]lib\.js$/);

  });

  test("should fallback to jsnext:main field", async () => {

    const analized = await analize(cwd, { "jsnext:main": "out/lib.js" });

    expect((analized.output.module as ESModuleBuildInfo).file).toMatch(/out[\\/]lib\.js$/);

  });

});
