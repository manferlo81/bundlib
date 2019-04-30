import { EventEmitter } from "events";
import { OutputOptions, rollup, RollupOptions } from "rollup";
import { BUILDING, BUILT, WRITING, WRITTEN } from "./events";
import oneByOne from "./one-by-one";
import { BuildEventEmitter, BuldFunction } from "./types";

const build: BuldFunction = async (configs) => {

  const result: BuildEventEmitter = new EventEmitter();

  setImmediate(() => {

    result.emit(BUILDING);

    oneByOne(configs, async (config, next, index) => {

      if (!config.output) {
        return next();
      }

      const filename = (config.output as OutputOptions).file as string;

      result.emit(WRITING, filename);

      const buildResult = await rollup(config as RollupOptions);
      await buildResult.write(config.output);

      result.emit(WRITTEN, filename);

      next();

      if (index + 1 >= configs.length) {
        result.emit(BUILT);
      }

    });

  });

  return result;

};

export default build;
