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

  function ERROR(event: WatchEvent) {
    if (callbacks.error) {
      callbacks.error(event.error);
    }
  }

  const table: Record<string, (event: WatchEvent) => void> = {

    START: () => {
      if (callbacks.start) {
        callbacks.start();
      }
    },

    END: () => {
      if (callbacks.end) {
        callbacks.end();
      }
    },

    BUNDLE_START: (event) => {
      if (callbacks.buildStart) {
        const { output: out } = event;
        const { length: len } = out;
        for (let i = 0; i < len; i++) {
          callbacks.buildStart(event.input, out[i]);
        }
      }
    },

    BUNDLE_END: (event) => {
      if (callbacks.buildEnd) {
        const { output: out } = event;
        const { length: len } = out;
        for (let i = 0; i < len; i++) {
          const stats = statSync(out[i]);
          callbacks.buildEnd(
            out[i],
            stats.size,
            event.duration || 0,
          );
        }
      }
    },

    ERROR,
    FATAL: ERROR,

  };

  const watcher = rollupWatch(configs);

  watcher.on("event", (event: WatchEvent) => {

    const { code } = event;
    const handler = table[code];

    if (handler) {
      handler(event);
    }

  });

}

export default watch;
