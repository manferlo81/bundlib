import { statSync } from 'node:fs';
import type { RollupCache } from 'rollup';
import { rollup } from 'rollup';
import type { BundlibRollupConfig } from '../../api/types/rollup';
import type { BundlibEventEmitter } from '../actions/emitter-types';
import { promiseReduce } from '../tools/promise-reduce';

export async function rollupBuild(
  configs: BundlibRollupConfig[],
  emitter: BundlibEventEmitter,
): Promise<void> {

  // Group configs to process some of them concurrently
  const byCacheKey = configs.reduce(
    (configsMap, config) => {

      const { input, output: { format } } = config;
      const configSetKey = `${format}:${input}`;

      const configSet = configsMap.get(configSetKey);

      if (configSet) {
        configSet.add(config);
        return configsMap;
      }

      const newConfigSet = new Set<BundlibRollupConfig>([config]);
      return configsMap.set(configSetKey, newConfigSet);

    },
    new Map<string, Set<BundlibRollupConfig>>(),
  );

  // Get only the configs
  const configGroups = byCacheKey.values();

  // Emit start event
  emitter.emit('start');

  // Start building...
  const promises = configGroups.map((configs) => {

    // Create array of config from config set
    const configArray = Array.from(configs);

    // Process configs one by one
    return promiseReduce(
      configArray,
      async (cache: RollupCache | undefined, config) => {

        // Set cache into the config before start the build
        const configWithCache = { ...config, cache };

        // Store build start time
        const buildStartTime = Date.now();

        // Start the build
        const rollupBuild = await rollup(configWithCache);
        const { write } = rollupBuild;

        // Write to files
        const { output } = config;
        await write(output);

        // Compute duration
        const duration = Date.now() - buildStartTime;

        // Get file size
        const { file: outputFile } = output;
        const { size } = statSync(outputFile);

        // Emit event
        emitter.emit('build-end', outputFile, size, duration);

        // Return cache for next iteration
        const { cache: buildCache } = rollupBuild;
        return buildCache;

      },
    );
  });

  // Wait for all builds to finish
  await Promise.all(promises);

  // Emit end event
  emitter.emit('end');

}
