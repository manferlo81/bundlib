import { EventEmitter } from "events";
import { RollupWatcher, watch as rollupWatch } from "rollup";
import { BUILDING, BUILT, ERROR, REBUILDING, WATCHING, WRITING, WRITTEN } from "./events";
import { BuildEventEmitter, BuldFunction } from "./types";

function mapWatcherToEvents(watcher: RollupWatcher, result: BuildEventEmitter) {

  watcher.on("event", (event) => {

    const { code, output, error } = event;

    // tslint:disable-next-line: no-console
    // console.log(">>>>>>>", event);

    if (code === "START") {
      result.emit(
        REBUILDING,
      );
      result.emit(
        BUILDING,
      );
    } else if (code === "END") {
      result.emit(
        BUILT,
      );
      result.emit(
        WATCHING,
      );
    } else if (code === "BUNDLE_START") {
      for (const filename of output) {
        result.emit(
          WRITING,
          filename,
        );
      }
    } else if (code === "BUNDLE_END") {
      for (const filename of output) {
        result.emit(
          WRITTEN,
          filename,
        );
      }
    } else if (code === "ERROR" || code === "FATAL") {
      result.emit(
        ERROR,
        error,
      );
    }

  });

}

const watch: BuldFunction = (configs) => {

  const watcher = rollupWatch(configs);
  const result: BuildEventEmitter = new EventEmitter();

  mapWatcherToEvents(watcher, result);

  return result;

};

export default watch;
