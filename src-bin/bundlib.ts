import { analizePkg, pkgToConfigs } from "../src";

import { relative } from "path";

import build from "./build";
import { log } from "./console";
import { BundlibOptions } from "./types";
import watchBuild from "./watch";

async function bundlib(cwd: string, { dev, watch, silent }: BundlibOptions): Promise<void> {

  if (!silent) {
    log("> reading package.json...");
  }

  const pkg = await analizePkg(cwd);
  const configs = pkgToConfigs(pkg, dev);

  let buildIndex = 0;

  (watch ? watchBuild : build)(configs, silent ? {} : {

    buildEnd({ filename, duration, size }) {
      log(`built: ${relative(cwd, filename)} (${size} bytes) in ${duration} ms`);
    },

    error(err) {
      log(err);
    },

    ...watch && {

      start() {
        if (buildIndex) {
          log("> rebuilding...");
        }
        buildIndex++;
      },

      end() {
        log("> watching for changes...");
      },

    },

  });

}

export default bundlib;
