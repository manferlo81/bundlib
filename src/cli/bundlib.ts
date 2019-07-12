import { BundlibPkgJson, configsFromPkg } from "../api";

import build from "./build";
import { BuildCallbackObject, BundlibOptions } from "./types";
import watchBuild from "./watch";

async function bundlib(
  cwd: string,
  { dev, watch }: BundlibOptions,
  callbacks: BuildCallbackObject,
  pkg?: BundlibPkgJson,
): Promise<void> {
  (watch ? watchBuild : build)(
    await configsFromPkg(cwd, dev, watch, pkg),
    callbacks,
  );
}

export default bundlib;
