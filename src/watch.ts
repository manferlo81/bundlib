import { RollupWatchOptions, watch as rollupWatch } from "rollup";
import { log, showError, showInfo, written } from "./console";

export default (configs: RollupWatchOptions[], cwd: string) => {

  let firstTime = true;
  const watcher = rollupWatch(configs);

  watcher.on("event", (event) => {

    const { code, output, error } = event;

    if (code === "START") {
      if (firstTime) {
        firstTime = false;
      } else {
        showInfo("changes detected, rebuilding");
        log();
      }
    } else if (code === "BUNDLE_END") {
      for (const filename of output) {
        written(filename, cwd);
      }
    } else if (code === "END") {
      log();
      showInfo("watching for changes");
    } else if (code === "ERROR" || code === "FATAL") {
      showError(error);
    }

  });

  return watcher;

};
