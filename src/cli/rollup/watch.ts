import type { EventEmitter } from 'node:events';
import { statSync } from 'node:fs';
import type { RollupOptions, RollupWatcher } from 'rollup';
import { watch } from 'rollup';
import { EVENT_BUILD_END, EVENT_END, EVENT_ERROR, EVENT_REBUILD } from '../events';
import type { BundlibEventMap } from '../types/types';

export function rollupWatchBuild(
  configs: RollupOptions[],
  emitter: EventEmitter<BundlibEventMap>,
): RollupWatcher {

  const watcher = watch(configs);

  watcher.on('restart', (): void => {
    emitter.emit(EVENT_REBUILD);
  });

  watcher.on('event', (event): void => {

    switch (event.code) {

      case 'END': return void emitter.emit(EVENT_END);

      case 'BUNDLE_END': {
        const { output, duration } = event;
        return output.forEach((filename) => {
          const { size } = statSync(filename);
          emitter.emit(
            EVENT_BUILD_END,
            filename,
            size,
            duration,
          );
        });
      }

      case 'ERROR': {
        const { error } = event;
        emitter.emit(EVENT_ERROR, error);
      }

    }

  });

  return watcher;
}
