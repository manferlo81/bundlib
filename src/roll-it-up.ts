import { RollupOptions } from "rollup";

import build from "./build";
import { BuildEventEmitterOrPromise } from "./types";
import watchBuild from "./watch";

const rollItUp = (configs: RollupOptions[], watch: boolean): BuildEventEmitterOrPromise => {

  return watch
    ? watchBuild(configs)
    : build(configs);

};

export default rollItUp;
