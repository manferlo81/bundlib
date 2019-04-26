import { EventEmitter } from "events";
import { OutputOptions, rollup, RollupOptions } from "rollup";
import { WRITTEN } from "./events";
import sequential from "./sequential";
import { BuldFunction } from "./types";

const build: BuldFunction = (configs, cwd) => {

  const result = new EventEmitter();

  sequential(configs, async (config, index, next) => {

    if (!config.output) {
      return next();
    }

    const buildResult = await rollup(config as RollupOptions);

    await buildResult.write(config.output);

    const { file } = config.output as OutputOptions;

    // written(file as string, cwd);
    result.emit(WRITTEN, file);

    next();

  });

  return result;

};

export default build;
