import { OutputOptions, rollup, RollupOptions } from "rollup";
import { written } from "./console";

const build = (configs: RollupOptions[], cwd: string): void => {

  const buildIt = async (index: number = 0): Promise<void> => {

    const config = configs[index];

    if (!config) {
      return;
    }

    if (!config.output) {
      return buildIt(index as number + 1);
    }

    const buildResult = await rollup(config);

    await buildResult.write(config.output);

    written((config.output as OutputOptions).file as string, cwd);

    buildIt(index as number + 1);

  };

  buildIt();

};

export default build;
