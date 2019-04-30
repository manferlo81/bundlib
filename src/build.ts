import { EventEmitter } from "events";
import { OutputOptions, rollup, RollupOptions } from "rollup";
import { WRITING, WRITTEN } from "./events";
import oneByOne from "./one-by-one";
import { BuildEventEmitter, BuldFunction } from "./types";

const build: BuldFunction = async (configs) => {

  const result: BuildEventEmitter = new EventEmitter();

  oneByOne(configs, async (config, next) => {

    if (!config.output) {
      return next();
    }

    const filename = (config.output as OutputOptions).file as string;

    result.emit(WRITING, filename);

    const buildResult = await rollup(config as RollupOptions);
    await buildResult.write(config.output);

    result.emit(WRITTEN, filename);

    next();

  });

  return result;

};

export default build;
