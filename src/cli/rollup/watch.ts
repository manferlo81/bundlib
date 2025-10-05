import type { EventEmitter } from 'node:events';
import { statSync } from 'node:fs';
import type { RollupOptions, RollupWatcher } from 'rollup';
import { watch } from 'rollup';
import type { BundlibEventMap } from '../types/types';

export function rollupWatchBuild(
  configs: RollupOptions[],
  emitter: EventEmitter<BundlibEventMap>,
): RollupWatcher {

  const watcher = watch(configs);

  watcher.on('restart', (): void => {
    emitter.emit('rebuild');
  });

  watcher.on('event', (event): void => {

    switch (event.code) {

      case 'START': return void emitter.emit('start');
      case 'END': return void emitter.emit('end');

      case 'BUNDLE_END': {
        const { output, duration } = event;
        return output.forEach((filename) => {
          const { size } = statSync(filename);
          emitter.emit(
            'build-end',
            filename,
            size,
            duration,
          );
        });
      }

      case 'ERROR': {
        const { error } = event;
        emitter.emit('error', error);
      }

    }

  });

  return watcher;
}
