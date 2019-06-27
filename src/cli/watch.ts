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

  });

}

export default watch;
