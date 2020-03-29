import { EventEmitter } from 'events';
import { statSync } from 'fs';
import { rollup, RollupCache } from 'rollup';
import { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from '../api/types';
import { BUILD_END, BUILD_START, END, ERROR, START } from './events';
import oneByOne from './one-by-one';

function build(
  configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>,
  emitter: EventEmitter,
): void {

  emitter.emit(START);

  const cache: Partial<Record<string, RollupCache>> = {};

  oneByOne(configs, async (config, next) => {

    const { input, output } = config;
    const { file: outputFile, format } = output;

    const cacheKey = `${format}:${input}`;
    config.cache = cache[cacheKey];

    emitter.emit(BUILD_START, input, outputFile);

    try {

      const currentTime = Date.now();

      const buildResult = await rollup(config);
      config.cache = cache[cacheKey] = buildResult.cache;
      await buildResult.write(output);

      const { size } = statSync(outputFile);
      const totalTime = Date.now() - currentTime;

      emitter.emit(BUILD_END, outputFile, size, totalTime);

    } catch (err) {

      emitter.emit(ERROR, err);
      emitter.emit(END);

      throw err;

    }

    if (next) {
      return next();
    }

    emitter.emit(END);

  });

}

export default build;
