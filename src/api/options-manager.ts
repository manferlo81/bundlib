import { cosmiconfig } from 'cosmiconfig';
import { resolve } from 'path';
import slash from 'slash';
import { BundlibOptions } from './bundlib-options';
import { OPTION_FILE_PATHS, PRODUCT_NAME } from './consts';
import { error } from './errors';
import { isString } from './type-check';

interface LoadedOptions {
  config: BundlibOptions;
  filepath: string | null;
}

export async function loadOptions(cwd: string, optionsFromPkgJson: BundlibOptions | string | null | undefined): Promise<LoadedOptions> {

  const manager = cosmiconfig(PRODUCT_NAME, {
    stopDir: cwd,
    searchPlaces: OPTION_FILE_PATHS,
    ignoreEmptySearchPlaces: false,
  });

  if (optionsFromPkgJson) {

    if (!isString(optionsFromPkgJson)) {
      return { config: optionsFromPkgJson, filepath: null };
    }

    const filename = resolve(cwd, optionsFromPkgJson);
    const data = await manager.load(filename);

    if (!data) {
      throw error<Error>(`Unknown error loading options from ${slash(filename)}.`, Error);
    }

    return data;

  }

  const data = await manager.search();

  if (!data) {
    throw error<Error>('Unknown error loading options.', Error);
  }

  return data;

}
