import { RollupWarning } from "rollup";

import { BundlibPkgJson, configsFromPkg } from "../api";

import build from "./build";
import { BuildCallbackObject, BundlibOptions } from "./types";
import watchBuild from "./watch";

async function bundlib(
  cwd: string,
  options: BundlibOptions,
  callbacks: BuildCallbackObject,
  pkg?: BundlibPkgJson,
): Promise<void> {

  const configs = await configsFromPkg(cwd, options, pkg);

  const { warn } = callbacks;

  configs.forEach((config) => {
    config.onwarn = (warning: string | RollupWarning) => {
      if (warn) {
        warn(warning);
      }
    };
  });

  (options.watch ? watchBuild : build)(
    configs,
    callbacks,
  );

}

export default bundlib;
