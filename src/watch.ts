import { EventEmitter } from "events";
import { watch as rollupWatch } from "rollup";
import { BuildEventEmitter, BuildEventType, BuldFunction } from "./types";

const watch: BuldFunction = (configs) => {

  let firstTime = true;
  const watcher = rollupWatch(configs);

  const result: BuildEventEmitter = new EventEmitter();

  watcher.on("event", (event) => {

    const { code, output, error } = event;

    if (code === "START") {
      if (firstTime) {
        firstTime = false;
      } else {
        result.emit(
          BuildEventType.REBUILDING,
        );
      }
    } else if (code === "BUNDLE_END") {
      for (const filename of output) {
        result.emit(
          BuildEventType.WRITTEN,
          filename,
        );
      }
    } else if (code === "END") {
      result.emit(
        BuildEventType.WATCHING,
      );
    } else if (code === "ERROR" || code === "FATAL") {
      result.emit(
        BuildEventType.ERROR,
        error,
      );
    }

  });

  return result;

};

export default watch;
