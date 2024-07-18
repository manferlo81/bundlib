import { cosmiconfig } from 'cosmiconfig';
import { resolve } from 'path';
import { CONFIG_FILE_SEARCH_PLACES, PRODUCT_NAME } from '../consts/consts';
import type { AllowNullish } from '../types/helper-types';
import type { BundlibCosmiconfigResult } from './load-config-types';

export async function loadConfig(cwd: string, path: AllowNullish<string>): Promise<BundlibCosmiconfigResult> {

  // create manager
  const manager = cosmiconfig(PRODUCT_NAME, {
    stopDir: cwd,
    searchPlaces: CONFIG_FILE_SEARCH_PLACES,
    ignoreEmptySearchPlaces: false,
  });

  // search if not path provided
  if (!path) {
    return await manager.search();
  }

  // load config from path
  const configFilePath = resolve(cwd, path);
  return await manager.load(configFilePath);

}
