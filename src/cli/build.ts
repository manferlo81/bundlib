import { statSync } from "fs";
import { OutputOptions, rollup, RollupOptions } from "rollup";

import oneByOne from "./one-by-one";
import { BuildCallbackObject } from "./types";

function build(configs: RollupOptions[], callbacks: BuildCallbackObject): void {

  if (callbacks.start) {
    callbacks.start();
  }

  oneByOne(configs, async (config, next, index) => {

    const { input, output: outputOptions } = config as { input: string, output: OutputOptions };
    const { file: output } = outputOptions as { file: string };

    if (callbacks.buildStart) {
      callbacks.buildStart(input, output);
    }

    try {

      const currentTime = Date.now();

      const buildResult = await rollup(config);
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
