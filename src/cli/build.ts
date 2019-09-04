import { statSync } from "fs";
import { rollup } from "rollup";

import { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from "../api/types";

import oneByOne from "./one-by-one";
import { BuildCallbackObject } from "./types";

function build(
  configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>,
  callbacks: BuildCallbackObject,
): void {

  if (callbacks.start) {
    callbacks.start();
  }

  const cache: Record<string, object | undefined> = {};

  oneByOne(configs, async (config, next, index) => {

    const { input, output } = config;
    const { file: outputFile, format } = output;

    const isModuleBuild = format === "cjs" || format === "es";
    const cacheKey = `${isModuleBuild ? "module" : "browser"}:${input}`;
    config.cache = cache[cacheKey];

    if (callbacks.buildStart) {
      callbacks.buildStart(input, outputFile);
    }

    try {

      const currentTime = Date.now();

      const buildResult = await rollup(config);
      config.cache = cache[cacheKey] = buildResult.cache;
      await buildResult.write(output);

      const { size } = statSync(outputFile);
      const totalTime = Date.now() - currentTime;

      if (callbacks.buildEnd) {
        callbacks.buildEnd(
          outputFile,
          size,
          totalTime,
        );
      }

    } catch (err) {

      if (callbacks.error) {
        callbacks.error(err);
      }

    }

    if (index + 1 >= configs.length) {
      if (callbacks.end) {
        callbacks.end();
      }
    }

    next();

  });

}

export default build;
