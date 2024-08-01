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
      if (buildIndex) emitter.emit(EVENT_REBUILD, buildIndex);
      buildIndex++;
    },

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

  rollupWatch(configs).on('event', (event) => {
    const handleEvent = handlers[event.code];
    if (handleEvent) {
      handleEvent(event as never);
    }
  });

}
