import { EventEmitter } from "events";
import { watch as rollupWatch } from "rollup";
import { WRITTEN } from "./events";
import { BuldFunction } from "./types";

const watch: BuldFunction = (configs, cwd) => {

  let firstTime = true;
  const watcher = rollupWatch(configs);

  const result = new EventEmitter();

  watcher.on("event", (event) => {

    const { code, output/* , error */ } = event;

    if (code === "START") {
      if (firstTime) {
        firstTime = false;
      } else {
        // showInfo("changes detected, rebuilding");
        // log();
      }
    } else if (code === "BUNDLE_END") {
      for (const filename of output) {
        // written(filename, cwd);
        result.emit(WRITTEN, filename);
      }
    } else if (code === "END") {
      // log();
      // showInfo("watching for changes");
    } else if (code === "ERROR" || code === "FATAL") {
      // showError(error);
    }

  });

  return result;

};

export default watch;
