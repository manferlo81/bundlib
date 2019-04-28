import { EventEmitter } from "events";
import { OutputOptions, rollup, RollupOptions } from "rollup";
import sequential from "./sequential";
import { BuildEventEmitter, BuildEventType, BuldFunction } from "./types";

const build: BuldFunction = (configs) => {

  const result: BuildEventEmitter = new EventEmitter();

  sequential(configs, async (config, index, next) => {

    if (!config.output) {
      return next();
    }

    const buildResult = await rollup(config as RollupOptions);

    await buildResult.write(config.output);

    const { file } = config.output as OutputOptions;

    result.emit(BuildEventType.WRITTEN, file as string);

    next();

  });

  return result;

};

export default build;
