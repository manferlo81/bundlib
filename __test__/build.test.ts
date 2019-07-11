import { rollup } from "rollup";
import createConfigs from "./tools/create-configs";

import { dependencies } from "../package.json";

describe("build", () => {

  const cwd = process.cwd();

  test("should build a CommonJS module", async () => {

    const [config] = await createConfigs(cwd, false, {
      main: "out/lib.cjs.js",
      bundlib: { input: "src/api/analize-pkg.ts" },
      dependencies,
    });
    const build = await rollup(config);
    const { output: [{ code }] } = await build.generate(config.output);

    expect(typeof code)
      .toBe("string");

  }, 20000);

  test("should build a Binary", async () => {

    const [config] = await createConfigs(cwd, false, {
      bin: "out/lib.cjs.js",
      bundlib: { bin: "src/cli/index.ts" },
      dependencies,
    });
    const build = await rollup(config);
    const { output: [{ code }] } = await build.generate(config.output);

    expect(typeof code)
      .toBe("string");

  }, 20000);

  test("should build a Browser module", async () => {

    const [config] = await createConfigs(cwd, false, {
      browser: "out/lib.umd.js",
      bundlib: { input: "src/api/validate-options.ts", globals: null },
    });
    const build = await rollup(config);
    const { output: [{ code }] } = await build.generate(config.output);

    expect(typeof code)
      .toBe("string");

  }, 20000);

  test("should build a CommonJS and a Binary", async () => {

    const [cjsConfig, binConfig] = await createConfigs(cwd, false, {
      main: "out/lib.cjs.js",
      bin: "bin/cli.js",
      bundlib: { input: "src/api/index.ts", bin: "src/cli/index.ts" },
      dependencies,
    });
    const cjsBuild = await rollup(cjsConfig);
    const { output: [{ code: cjsCode }] } = await cjsBuild.generate(cjsConfig.output);

    expect(typeof cjsCode)
      .toBe("string");

    const binBuild = await rollup(binConfig);
    const { output: [{ code: binCode }] } = await binBuild.generate(binConfig.output);

    expect(typeof binCode)
      .toBe("string");

  }, 20000);

});
