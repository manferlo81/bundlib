import { cosmiconfig } from 'cosmiconfig';
import { resolve } from 'path';
import { OPTION_FILE_PATHS, PRODUCT_NAME } from './consts';
import { isString } from './type-check/basic';
import type { BundlibOptions } from './types/bundlib-options';
import type { Nullable, StrictNullable } from './types/helper-types';

interface LoadedOptions {
  config: Nullable<BundlibOptions>;
  filepath: StrictNullable<string>;
}

export async function loadOptions(cwd: string, optionsFromPkgJson: BundlibOptions | string | null | undefined): Promise<LoadedOptions | null> {

  const manager = cosmiconfig(PRODUCT_NAME, {
    stopDir: cwd,
    searchPlaces: OPTION_FILE_PATHS,
    ignoreEmptySearchPlaces: false,
  });

  if (optionsFromPkgJson) {

    if (!isString(optionsFromPkgJson)) {
      return { config: optionsFromPkgJson, filepath: null };
    }

    return manager.load(resolve(cwd, optionsFromPkgJson)) as Promise<LoadedOptions>;

  }

  return manager.search();

}
