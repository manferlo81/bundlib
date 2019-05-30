import { RollupOptions } from "rollup";

import build from "./build";
import { BuildEventEmitterOrPromise, BundlibOptions } from "./types";
import watchBuild from "./watch";

const rollItUp = (configs: RollupOptions[], { watch }: BundlibOptions = {}): BuildEventEmitterOrPromise => {

  return watch
    ? watchBuild(configs)
    : build(configs);

};

export default rollItUp;
