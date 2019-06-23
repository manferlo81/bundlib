import { RollupOptions } from "rollup";

import build from "./build";
import { BuildEventEmitter } from "./types";
import watchBuild from "./watch";

function rollItUp(configs: RollupOptions[], watch?: boolean): BuildEventEmitter {

  return watch
    ? watchBuild(configs)
    : build(configs);

}

export default rollItUp;
