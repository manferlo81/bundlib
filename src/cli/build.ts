import { statSync } from 'fs';
import { rollup } from 'rollup';
import type { RollupCache, RollupError } from 'rollup';
import type { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from '../api/types/types';
import { BUILD_END, END, ERROR } from './events';
import { oneByOne } from './one-by-one';
import type { BundlibEventEmitter } from './types';

export function build(
  configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>,
  emitter: BundlibEventEmitter,
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

        emitter.emit(BUILD_END, outputFile, size, totalTime);

      } catch (err) {
        next(err);
        throw err;
      }

      next();

    },
    (error) => {
      if (error) {
        emitter.emit(ERROR, error as RollupError);
      } else {
        emitter.emit(END);
      }
    },
  );

}
