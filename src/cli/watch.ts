import { statSync } from 'fs';
import { RollupOptions, RollupWatcherEvent, watch as rollupWatch } from 'rollup';
import { EVENT_BUILD_END, EVENT_END, EVENT_ERROR, EVENT_REBUILD } from './consts';
import { BundlibEventEmitter } from './types/types';

export function watch(
  configs: RollupOptions[],
  emitter: BundlibEventEmitter,
): void {

  let buildIndex = 0;

  const handlers: { [K in RollupWatcherEvent['code']]?: (event: Extract<RollupWatcherEvent, { code: K }>) => void } = {

    START() {
      if (buildIndex) {
        emitter.emit(EVENT_REBUILD, buildIndex);
      }
      buildIndex++;
    },

    END() {
      emitter.emit(EVENT_END);
    },

    BUNDLE_END(e) {
      const { length: len } = e.output;
      for (let i = 0; i < len; i++) {
        const stats = statSync(e.output[i]);
        emitter.emit(
          EVENT_BUILD_END,
          e.output[i],
          stats.size,
          e.duration,
        );
      }
    },

    ERROR(e) {
      emitter.emit(
        EVENT_ERROR,
        e.error,
      );
    },

  };

  rollupWatch(configs).on('event', (event) => {
    const handleEvent = handlers[event.code];
    if (handleEvent) {
      handleEvent(event as never);
    }
  });

}
