import type { EventEmitter } from 'events';
import { statSync } from 'fs';
import type { RollupOptions, RollupWatcher, RollupWatcherEvent } from 'rollup';
import { watch } from 'rollup';
import { EVENT_BUILD_END, EVENT_END, EVENT_ERROR, EVENT_REBUILD } from './consts';
import type { BundlibEventMap } from './types/types';

export function rollupWatch(
  configs: RollupOptions[],
  emitter: EventEmitter<BundlibEventMap>,
): RollupWatcher {

  type WatcherHandlerMap = {
    [K in RollupWatcherEvent['code']]?: (event: Extract<RollupWatcherEvent, { code: K }>) => void;
  };

  const handlers: WatcherHandlerMap = {

    END() {
      emitter.emit(EVENT_END);
    },

    BUNDLE_END(event) {
      const { output, duration } = event;
      for (const filename of output) {
        const { size } = statSync(filename);
        emitter.emit(
          EVENT_BUILD_END,
          filename,
          size,
          duration,
        );
      }
    },

    ERROR(event) {
      const { error } = event;
      emitter.emit(EVENT_ERROR, error);
    },

  };

  return watch(configs)
    .on('restart', () => {
      emitter.emit(EVENT_REBUILD);
    })
    .on('event', (event) => {
      const handleEvent = handlers[event.code];
      if (handleEvent) {
        handleEvent(event as never);
      }
    });

}
