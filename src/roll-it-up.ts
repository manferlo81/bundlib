import { RollupOptions } from "rollup";

import build from "./build";
import { BuildEventEmitter } from "./types";
import watchBuild from "./watch";

const rollItUp = async (configs: RollupOptions[], watch: boolean): Promise<BuildEventEmitter> => {

  return watch
    ? watchBuild(configs)
    : build(configs);

};

export default rollItUp;
