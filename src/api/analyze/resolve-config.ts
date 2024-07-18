import { error } from '../errors/error';
import { invalidPkgFieldMessage } from '../errors/error-messages';
import { isStringOrNullish } from '../type-check/advanced';
import { isDictionary } from '../type-check/basic';
import type { BundlibConfig } from '../types/bundlib-options';
import type { AllowNullish } from '../types/helper-types';
import { loadConfig } from '../config-file/load-config';

export async function resolveConfig(cwd: string, pkgBundlibConfig: AllowNullish<BundlibConfig | string>): Promise<BundlibConfig> {

  // return if config is and object
  // just check if config is an object, further checks will be performed later
  if (isDictionary(pkgBundlibConfig)) {
    return pkgBundlibConfig;
  }

  // throw if config value is invalid
  // making sure it's a string | null | undefined
  if (!isStringOrNullish(pkgBundlibConfig)) {
    throw error(invalidPkgFieldMessage('bundlib', 'BundlibConfig | string'));
  }

  // try to load configuration
  const loadedConfig = await loadConfig(cwd, pkgBundlibConfig);

  // return empty config if not found
  if (!loadedConfig) return {};

  // get loaded data
  const { config, filepath } = loadedConfig;

  // throw if file doesn't content a valid config
  // making sure config is an object
  // just check if config is an object, further checks will be performed later
  if (!isDictionary(config)) {
    throw error(`Invalid config found on file "${filepath}".`);
  }

  return config;

}
