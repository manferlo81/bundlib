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

  START(callbacks) {
    if (callbacks.start) {
      callbacks.start();
    }
  },

  END(callbacks) {
    if (callbacks.end) {
      callbacks.end();
    }
  },

  BUNDLE_START(callbacks, { output }) {
    if (callbacks.buildStart) {
      for (const filename of output) {
        callbacks.buildStart(filename);
      }
    }
  },

  BUNDLE_END(callbacks, { output, duration }) {
    if (callbacks.buildEnd) {
      for (const filename of output) {
        callbacks.buildEnd({
          filename,
          duration: duration || 0,
          size: 0,
        });
      }
    }
  },

  ERROR: ERR,
  FATAL: ERR,

};

function watch(configs: RollupOptions[], callbacks: BuildCallbackObject): void {

  const watcher = rollupWatch(configs);

  watcher.on("event", (event: WatchEvent) => {

    const { code } = event;

    const emit: EmitMethod | undefined = map[code];
    if (emit) {
      emit(callbacks, event);
    }

  });

}

export default watch;
