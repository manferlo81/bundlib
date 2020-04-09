import { statSync } from 'fs';
import { RollupOptions, RollupWatcherEvent, watch as rollupWatch } from 'rollup';
import { BUILD_END, END, ERROR, REBUILD } from './events';
import { BundlibEventEmitter } from './types';

export function watch(
  configs: RollupOptions[],
  emitter: BundlibEventEmitter,
): void {

  let buildIndex = 0;

  const handlers: { [K in RollupWatcherEvent['code']]?: (event: Extract<RollupWatcherEvent, { code: K }>) => void } = {

    START() {
      if (buildIndex) {
        emitter.emit(REBUILD, buildIndex);
      }
      buildIndex++;
    },

    END() {
      emitter.emit(END);
    },

    BUNDLE_END(e) {
      const { length: len } = e.output;
      for (let i = 0; i < len; i++) {
        const stats = statSync(e.output[i]);
        emitter.emit(
          BUILD_END,
          e.output[i],
          stats.size,
          e.duration,
        );
      }
    },

    ERROR(e) {
      emitter.emit(
        ERROR,
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
