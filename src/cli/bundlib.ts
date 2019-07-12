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
  (options.watch ? watchBuild : build)(
    await configsFromPkg(cwd, options, pkg),
    callbacks,
  );
}

export default bundlib;
