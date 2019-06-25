import { statSync } from "fs";
import { RollupOptions, watch as rollupWatch } from "rollup";

import { BuildCallbackObject } from "./types";

interface WatchEvent {
  code: string;
  duration: number;
  input: string;
  output: string[];
  error: Error;
}

type EmitMethod = (callbacks: BuildCallbackObject, event: WatchEvent) => void;

const ERR: EmitMethod = (callbacks, { error }) => {
  if (callbacks.error) {
    callbacks.error(error);
  }
};

const map: Record<string, EmitMethod> = {

  ERROR: ERR,
  FATAL: ERR,

};

function watch(configs: RollupOptions[], callbacks: BuildCallbackObject): void {

  const watcher = rollupWatch(configs);

  watcher.on("event", (event: WatchEvent) => {

    const { code, input, output, duration, error } = event;

    if (callbacks.start && code === "START") {
      callbacks.start();
    }

    if (callbacks.end && code === "END") {
      callbacks.end();
    }

    if (callbacks.buildStart && code === "BUNDLE_START") {
      for (const filename of output) {
        callbacks.buildStart(input, filename);
      }
    }

    if (callbacks.buildEnd && code === "BUNDLE_END") {
      for (const filename of output) {
        const { size } = statSync(filename);
        callbacks.buildEnd(
          filename,
          size,
          duration || 0,
        );
      }
    }

    if (callbacks.error && (code === "ERROR" || code === "FATAL")) {
      callbacks.error(error);
    }

    const emit: EmitMethod | undefined = map[code];
    if (emit) {
      emit(callbacks, event);
    }

  });

}

export default watch;
