import { statSync } from "fs";
import { rollup } from "rollup";

import { BundlibRollupOptions, BundlibRollupOutputOptions } from "../api/types";

import oneByOne from "./one-by-one";
import { BuildCallbackObject } from "./types";

function build(configs: Array<BundlibRollupOptions<BundlibRollupOutputOptions>>, callbacks: BuildCallbackObject): void {

  if (callbacks.start) {
    callbacks.start();
  }

  const cache: Record<string, object | undefined> = {};

  oneByOne(configs, async (config, next, index) => {

    const { input, output: outputOptions } = config;
    const { file: output, format } = outputOptions;

    const isModuleBuild = format === "cjs" || format === "es";
    const cacheKey = (isModuleBuild ? "module:" : "browser:") + input;
    config.cache = cache[cacheKey];

    if (callbacks.buildStart) {
      callbacks.buildStart(input, output);
    }

    try {

      const currentTime = Date.now();

      const buildResult = await rollup(config);
      config.cache = cache[cacheKey] = buildResult.cache;
      await buildResult.write(outputOptions);

      const { size } = statSync(output);

      const totalTime = Date.now() - currentTime;

      if (callbacks.buildEnd) {
        callbacks.buildEnd(
          output,
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
