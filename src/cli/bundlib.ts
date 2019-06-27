import { configsFromPkg } from "../api";

import build from "./build";
import { BuildCallbackObject, BundlibOptions } from "./types";
import watchBuild from "./watch";

async function bundlib(
  cwd: string,
  { dev, watch }: BundlibOptions,
  callbacks: BuildCallbackObject,
): Promise<void> {
  (watch ? watchBuild : build)(
    await configsFromPkg(cwd, dev),
    callbacks,
  );
}

export default bundlib;
