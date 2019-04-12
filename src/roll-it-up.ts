import { RollupOptions, RollupWatcher } from "rollup";

import build from "./build";
import watchBuild from "./watch";

const rollItUp = async (configs: RollupOptions[], cwd: string, watch: boolean): Promise<RollupWatcher | void> => {

  if (watch) {
    return watchBuild(configs, cwd);
  }

  build(configs, cwd);

};

export default rollItUp;
