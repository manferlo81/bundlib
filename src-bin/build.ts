import { EventEmitter } from "events";
import { OutputOptions, rollup, RollupOptions } from "rollup";

import { BUILDING, BUILT, WRITING, WRITTEN } from "./events";
import oneByOne from "./one-by-one";
import { BuildEventEmitter, BuldFunction } from "./types";

function build(configs: RollupOptions[]): BuildEventEmitter {

  const result: BuildEventEmitter = new EventEmitter();

  setImmediate(() => {

    result.emit(BUILDING);

    oneByOne(configs, async (config, next, index) => {

      const output = config.output as OutputOptions;
      const filename = output.file as string;

      result.emit(WRITING, filename);

      const buildResult = await rollup(config);
      await buildResult.write(output);

      result.emit(WRITTEN, filename);

      next();

      if (index + 1 >= configs.length) {
        result.emit(BUILT);
      }

    });

  });

  return result;

}

export default (build as BuldFunction);
