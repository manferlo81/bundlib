import type { EventEmitter } from 'events';
import { statSync } from 'fs';
import type { RollupCache, RollupError } from 'rollup';
import { rollup } from 'rollup';
import type { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from '../../api/types/rollup';
import { EVENT_BUILD_END, EVENT_END, EVENT_ERROR } from '../events';
import { oneByOne } from '../one-by-one';
import type { BundlibEventMap } from '../types/types';

export function rollupBuild(
  configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>,
  emitter: EventEmitter<BundlibEventMap>,
): void {

  const cache: Partial<Record<string, RollupCache>> = {};

  oneByOne(
    configs,
    async (config, next) => {

      const { input, output } = config;
      const { file: outputFile, format } = output;

      const cacheKey = `${format}:${input}`;
      config.cache = cache[cacheKey];

      try {

        const currentTime = Date.now();

        const buildResult = await rollup(config);
        config.cache = cache[cacheKey] = buildResult.cache;
        await buildResult.write(output);

        const { size } = statSync(outputFile);
        const totalTime = Date.now() - currentTime;

        emitter.emit(EVENT_BUILD_END, outputFile, size, totalTime);

        next();

      } catch (err) {
        next(err);
        throw err;
      }

    },
    (error) => {
      if (error) {
        emitter.emit(EVENT_ERROR, error as RollupError);
      } else {
        emitter.emit(EVENT_END);
      }
    },
  );

}
