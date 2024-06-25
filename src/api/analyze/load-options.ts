import { cosmiconfig } from 'cosmiconfig';
import { resolve } from 'path';
import { CONFIG_FILE_SEARCH_PLACES, PRODUCT_NAME } from '../consts/consts';
import { isString } from '../type-check/basic';
import type { BundlibOptions } from '../types/bundlib-options';
import type { Nullable, StrictNullable } from '../types/helper-types';

interface LoadedOptions {
  config: Nullable<BundlibOptions>;
  filepath: StrictNullable<string>;
}

export async function loadOptions(cwd: string, optionsFromPkgJson: Nullable<BundlibOptions | string>): Promise<LoadedOptions | null> {

  const manager = cosmiconfig(PRODUCT_NAME, {
    stopDir: cwd,
    searchPlaces: CONFIG_FILE_SEARCH_PLACES,
    ignoreEmptySearchPlaces: false,
  });

  if (optionsFromPkgJson) {

    if (isString(optionsFromPkgJson)) {
      const configFilePath = resolve(cwd, optionsFromPkgJson);
      return manager.load(configFilePath);
    }

    return { config: optionsFromPkgJson, filepath: null };

  }

  return manager.search();

}
