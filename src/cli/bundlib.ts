import { analizePkg, pkgToConfigs } from "../api";

import build from "./build";
import { BuildCallbackObject, BundlibOptions } from "./types";
import watchBuild from "./watch";

async function bundlib(
  cwd: string,
  { dev, watch }: BundlibOptions,
  callbacks: BuildCallbackObject,
): Promise<void> {

  const pkg = await analizePkg(cwd);
  const configs = pkgToConfigs(pkg, dev);

  (watch ? watchBuild : build)(configs, callbacks);

}

export default bundlib;
