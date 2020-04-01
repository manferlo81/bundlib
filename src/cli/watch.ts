import { EventEmitter } from 'events';
import { statSync } from 'fs';
import { RollupOptions, watch as rollupWatch } from 'rollup';
import { BUILD_END, BUILD_START, END, ERROR, START } from './events';

export function watch(
  configs: RollupOptions[],
  emitter: EventEmitter,
): void {

  const watcher = rollupWatch(configs);

  watcher.on('event', (event) => {
    if (event.code === 'START') {
      emitter.emit(START);
    } else if (event.code === 'END') {
      emitter.emit(END);
    } else if (event.code === 'BUNDLE_START') {
      const { output: out } = event;
      const { length: len } = out;
      for (let i = 0; i < len; i++) {
        emitter.emit(
          BUILD_START,
          out[i],
        );
      }
    } else if (event.code === 'BUNDLE_END') {
      const { output: out } = event;
      const { length: len } = out;
      for (let i = 0; i < len; i++) {
        const stats = statSync(out[i]);
        emitter.emit(
          BUILD_END,
          out[i],
          stats.size,
          event.duration,
        );
      }
    } else if (event.code === 'ERROR') {
      emitter.emit(
        ERROR,
        event.error,
      );
    }
  });

}
