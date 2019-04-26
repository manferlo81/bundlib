import { RollupOptions } from "rollup";

import build from "./build";
import { BuildEventEmitter } from "./types";
import watchBuild from "./watch";

const rollItUp = async (configs: RollupOptions[], cwd: string, watch: boolean): Promise<BuildEventEmitter> => {

  if (watch) {
    return watchBuild(configs, cwd);
  }

  return build(configs, cwd);

};

export default rollItUp;
