import type { EventEmitter } from 'node:events';
import { statSync } from 'node:fs';
import type { RollupOptions, RollupWatcher, RollupWatcherEvent } from 'rollup';
import { watch } from 'rollup';
import { EVENT_BUILD_END, EVENT_END, EVENT_ERROR, EVENT_REBUILD } from '../events';
import type { BundlibEventMap } from '../types/types';

function createWatchHandlers(emitter: EventEmitter<BundlibEventMap>) {

  // create restart handler
  const handleRestart = (): void => {
    emitter.emit(EVENT_REBUILD);
  };

  // create event handler
  const handleEvent = (event: RollupWatcherEvent): void => {
    const { code } = event;
    if (code === 'END') {
      emitter.emit(EVENT_END);
    } else if (code === 'BUNDLE_END') {
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
    } else if (code === 'ERROR') {
      const { error } = event;
      emitter.emit(EVENT_ERROR, error);
    }
  };

  // return handlers
  return [handleRestart, handleEvent] as const;
}

export function rollupWatchBuild(
  configs: RollupOptions[],
  emitter: EventEmitter<BundlibEventMap>,
): RollupWatcher {

  // create watch handlers
  const [handleRestart, handleEvent] = createWatchHandlers(emitter);

  // watch build
  return watch(configs)
    .on('restart', handleRestart)
    .on('event', handleEvent);
}
