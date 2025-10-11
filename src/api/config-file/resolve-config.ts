import { error } from '../errors/error'
import { invalidPkgFieldMessage } from '../errors/error-messages'
import type { BundlibConfig } from '../options/types/bundlib'
import { isStringOrNullish } from '../type-check/advanced'
import { isDictionary } from '../type-check/basic'
import type { MaybeNullish } from '../types/helper-types'
import { loadConfig } from './load-config'

/**
 * Resolve Bundlib configuration
 *
 * @param cwd directory where to search for configuration files if needed
 * @param pkgBundlibConfig package.json "bundlib" field content
 * @returns resolved Bundlib configuration
 */
export async function resolveConfig(cwd: string, pkgBundlibConfig: MaybeNullish<BundlibConfig | string>): Promise<BundlibConfig> {

  // return if config is and object
  // just check if config is an object, further checks will be performed later
  if (isDictionary(pkgBundlibConfig)) {
    return pkgBundlibConfig
  }

  // throw if config value is invalid
  // making sure it's a string | null | undefined
  if (!isStringOrNullish(pkgBundlibConfig)) {
    throw error(invalidPkgFieldMessage('bundlib', 'BundlibConfig | string'))
  }

  // try to load configuration
  // it will throw if you pass an invalid path as string
  const loadedConfig = await loadConfig(cwd, pkgBundlibConfig)

  // return empty config if not found
  if (!loadedConfig) return {}

  // get loaded data
  const { config, filepath } = loadedConfig

  // throw if file doesn't content a valid config
  // making sure config is an object
  // just check if config is an object, further checks will be performed later
  if (!isDictionary(config)) {
    throw error(`Invalid config found on file "${filepath}".`)
  }

  // return configuration
  return config

}
