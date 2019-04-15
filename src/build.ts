import { OutputOptions, rollup, RollupOptions } from "rollup";
import { written } from "./console";
import sequential from "./sequential";

const build = (configs: RollupOptions[], cwd: string): void => {

  sequential(configs, async (config, index, next) => {

    if (!config.output) {
      return next();
    }

    const buildResult = await rollup(config);

    await buildResult.write(config.output);

    written((config.output as OutputOptions).file as string, cwd);

    next();

  });

};

export default build;
