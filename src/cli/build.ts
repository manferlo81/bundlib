import { statSync } from 'fs'
import { rollup, RollupCache } from 'rollup'

import { BundlibRollupModuleOutputOptions, BundlibRollupOptions } from '../api/types'

import oneByOne from './one-by-one'
import { BuildCallbackObject } from './types'

function build(
  configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>,
  callbacks: BuildCallbackObject,
): void {

  if (callbacks.start) {
    callbacks.start()
  }

  const cache: Partial<Record<string, RollupCache>> = {}

  oneByOne(configs, async (config, next) => {

    const { input, output } = config
    const { file: outputFile, format } = output

    const isModuleBuild = format === 'cjs' || format === 'es'
    const cacheKey = `${isModuleBuild ? 'module' : 'browser'}:${input}`
    config.cache = cache[cacheKey]

    if (callbacks.buildStart) {
      callbacks.buildStart(input, outputFile)
    }

    try {

      const currentTime = Date.now()

      const buildResult = await rollup(config)
      // eslint-disable-next-line require-atomic-updates
      config.cache = cache[cacheKey] = buildResult.cache
      await buildResult.write(output)

      const { size } = statSync(outputFile)
      const totalTime = Date.now() - currentTime

      if (callbacks.buildEnd) {
        callbacks.buildEnd(
          outputFile,
          size,
          totalTime,
        )
      }

    } catch (err) {

      if (callbacks.error) {
        callbacks.error(err)
      }

    }

    if (next) {
      return next()
    }

    if (callbacks.end) {
      callbacks.end()
    }

  })

}

export default build
