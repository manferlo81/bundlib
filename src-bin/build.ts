import { OutputOptions, rollup, RollupOptions } from "rollup";

import oneByOne from "./one-by-one";
import { BuildCallbackObject } from "./types";

function build(configs: RollupOptions[], callbacks: BuildCallbackObject): void {

  oneByOne(configs, async (config, next, index) => {

    if (index === 0) {
      if (callbacks.start) {
        callbacks.start();
      }
    }

    const output = config.output as OutputOptions;
    const filename = output.file as string;

    if (callbacks.buildStart) {
      callbacks.buildStart(filename);
    }

    const currentTime = Date.now();

    try {
      const buildResult = await rollup(config);
      await buildResult.write(output);
    } catch (err) {
      if (callbacks.error) {
        callbacks.error(err);
      }
    }

    const totalTime = Date.now() - currentTime;

    if (callbacks.buildEnd) {
      callbacks.buildEnd({
        filename,
        duration: totalTime,
        size: 0,
      });
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
