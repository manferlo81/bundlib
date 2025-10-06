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
  const byCacheKey = configs.reduce<Record<string, BundlibRollupConfig[]>>((configsMap, config) => {

    const { input, output: { format } } = config;
    const configSetKey = `${format}:${input}`;

    const currentConfigList = configsMap[configSetKey] as BundlibRollupConfig[] | undefined;
    const configList = currentConfigList ? [...currentConfigList, config] : [config];

    return { ...configsMap, [configSetKey]: configList };

  }, {});

  // Get only the configs
  const configGroups = Object.values(byCacheKey);

  // Emit start event
  emitter.emit('start');

  // Start building...
  const concurrentBuildPromises = configGroups.map((configs) => {

    // Process configs one by one
    return promiseReduce(
      configs,
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
  await Promise.all(concurrentBuildPromises);

  // Emit end event
  emitter.emit('end');

}
