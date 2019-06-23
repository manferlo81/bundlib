import { EventEmitter } from "events";
import { RollupOptions, watch as rollupWatch } from "rollup";
import { BUILDING, BUILT, ERROR, WRITING, WRITTEN } from "./events";
import { BuildEventEmitter, BuldFunction } from "./types";

interface WatchEvent {
  output: any;
  error: any;
}

type EmitMethod = (result: EventEmitter, event: WatchEvent) => void;

const ERR: EmitMethod = (result, { error }) => {
  result.emit(
    ERROR,
    error,
  );
};

const map: Record<string, EmitMethod> = {

  START(result) {
    result.emit(BUILDING);
  },

  END(result) {
    result.emit(BUILT);
  },

  BUNDLE_START(result, { output }) {
    for (const filename of output) {
      result.emit(
        WRITING,
        filename,
      );
    }
  },

  BUNDLE_END(result, { output }) {
    for (const filename of output) {
      result.emit(
        WRITTEN,
        filename,
      );
    }
  },

  ERROR: ERR,
  FATAL: ERR,

};

function watch(configs: RollupOptions[]): BuildEventEmitter {

  const watcher = rollupWatch(configs);
  const result: BuildEventEmitter = new EventEmitter();

  watcher.on("event", (event) => {

    const { code } = event;

    const emit: EmitMethod | undefined = map[code];
    if (emit) {
      emit(result, event);
    }

  });

  return result;

}

export default (watch as BuldFunction);
