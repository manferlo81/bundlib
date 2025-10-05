import { statSync } from 'node:fs';
import type { RollupCache } from 'rollup';
import { rollup } from 'rollup';
import type { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from '../../api/types/rollup';
import type { BundlibEventEmitter } from '../actions/emitter-types';
import { oneByOne } from '../tools/one-by-one';

export async function rollupBuild(
  configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>,
  emitter: BundlibEventEmitter,
): Promise<void> {

  const cacheObject: Partial<Record<string, RollupCache>> = {};

  // Group configs by cache key
  const byCacheKey = configs.reduce<Partial<Record<string, Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>>>>((output_, config) => {

    const { input, output: { format } } = config;
    const cacheKey = `${format}:${input}`;

    const list = output_[cacheKey];

    return {
      ...output_,
      [cacheKey]: list ? [...list, config] : [config],
    };

  }, {});

  emitter.emit('start');

  const promises = Object.entries(byCacheKey).map(([cacheKey, configs]) => {

    return new Promise<void>((resolve, reject) => {

      oneByOne(
        configs as unknown as NonNullable<typeof configs>,
        async (config, next) => {

          const { output } = config;
          const { file: outputFile } = output;

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
          // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
          if (error) return reject(error);
          resolve();
        },
      );

    });

  });

  await Promise.all(promises);
  emitter.emit('end');

}
