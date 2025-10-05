import type { EventEmitter } from 'node:events';
import { statSync } from 'node:fs';
import type { RollupCache, RollupError } from 'rollup';
import { rollup } from 'rollup';
import type { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from '../../api/types/rollup';
import { oneByOne } from '../one-by-one';
import type { BundlibEventMap } from '../types/types';

export function rollupBuild(
  configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>,
  emitter: EventEmitter<BundlibEventMap>,
): void {

  const cacheObject: Partial<Record<string, RollupCache>> = {};

  emitter.emit('start');

  oneByOne(
    configs,
    async (config, next) => {

      const { input, output } = config;
      const { file: outputFile, format } = output;

      const cacheKey = `${format}:${input}`;
      const storedCache = cacheObject[cacheKey];
      const configWithCache = { ...config, cache: storedCache };

      try {

        const buildStartTime = Date.now();

        const { cache: buildCache, write } = await rollup(configWithCache);
        cacheObject[cacheKey] = buildCache;

        await write(output);

        const duration = Date.now() - buildStartTime;
        const { size } = statSync(outputFile);

        emitter.emit('build-end', outputFile, size, duration);

        next();

      } catch (err) {
        next(err);
        throw err;
      }

    },
    (error) => {
      if (error) {
        emitter.emit('error', error as RollupError);
      } else {
        emitter.emit('end');
      }
    },
  );

}
