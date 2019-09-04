import { BundlibPkgJson, configsFromPkg } from "../api";

import { RollupWarning } from "rollup";
import build from "./build";
import { BuildCallbackObject, BundlibOptions } from "./types";
import watch from "./watch";

async function bundlib(
  cwd: string,
  options: BundlibOptions,
  callbacks: BuildCallbackObject,
  pkg?: BundlibPkgJson,
): Promise<void> {

  const configs = await configsFromPkg(cwd, options, pkg);

  const { warn } = callbacks;

  const onwarn = warn ? (warning: string | RollupWarning) => warn(warning) : (() => null);

  configs.forEach((config) => {
    config.onwarn = onwarn;
  });

  (options.watch ? watch : build)(
    configs,
    callbacks,
  );

}

export default bundlib;
