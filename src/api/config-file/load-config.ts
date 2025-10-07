import { cosmiconfig } from 'cosmiconfig'
import { resolve } from 'node:path'
import { PRODUCT_NAME } from '../constants/product'
import type { AllowNullish } from '../types/helper-types'
import type { BundlibCosmiconfigResult } from './load-config-types'

/**
 * Loads Bundlib config from file
 *
 * @param cwd directory where to search for configuration files if needed
 * @param path optional configuration file path relative to cwd
 * @returns cosmiconfig result
 */
export async function loadConfig(cwd: string, path: AllowNullish<string>): Promise<BundlibCosmiconfigResult> {

  // create search places
  const searchPlaces = [
    ...['', '.json', '.yaml', '.yml', '.js'].map((ext) => `.${PRODUCT_NAME}rc${ext}`),
    ...['js', 'cjs', 'mjs', 'ts'].map((ext) => `${PRODUCT_NAME}.config.${ext}`),
  ]

  // create manager
  const manager = cosmiconfig(PRODUCT_NAME, {
    stopDir: cwd,
    searchPlaces,
    ignoreEmptySearchPlaces: false,
  })

  // search if not path provided
  if (!path) {
    return await manager.search()
  }

  // load config from path
  // it will throw if path is invalid
  const configFilePath = resolve(cwd, path)
  return await manager.load(configFilePath)

}
