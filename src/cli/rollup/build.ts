import { statSync } from 'node:fs'
import type { RollupCache } from 'rollup'
import { rollup } from 'rollup'
import type { BundlibRollupConfig } from '../../api/options/types/rollup-options'
import type { BundlibEventEmitter } from '../actions/emitter-types'
import { promiseReduce } from '../tools/promise-reduce'
import { startTimer } from '../tools/timer'
import { groupConfigs } from './group-configs'

export async function rollupBuild(
  configs: BundlibRollupConfig[],
  emitter: BundlibEventEmitter,
): Promise<void> {

  // Group configs to process some of them concurrently
  const configGroups = groupConfigs(configs)

  // Emit start event
  emitter.emit('start')

  // Start building...
  const concurrentBuildPromises = configGroups.map((configs) => {

    // Process configs one by one
    return promiseReduce(
      configs,
      async (cache: RollupCache | undefined, config) => {

        // Set cache into the config before start the build
        const { output } = config
        const { file: outputFile } = output
        const configWithCache = { ...config, cache }

        // Emit file start event right before start building
        emitter.emit('file-start', outputFile)

        // Start timer
        const stopTimer = startTimer()

        // Start the build
        const rollupBuild = await rollup(configWithCache)
        const { write } = rollupBuild

        // Write to files
        await write(output)

        // Get duration before anything else
        const duration = stopTimer()

        // Get file size
        const { size } = statSync(outputFile)

        // Emit file end event
        emitter.emit('file-end', outputFile, size, duration, !!cache)

        // Return cache for next iteration
        const { cache: buildCache } = rollupBuild
        return buildCache

      },
    )
  })

  // Wait for all builds to finish
  await Promise.all(concurrentBuildPromises)

  // Emit end event
  emitter.emit('end')

}
