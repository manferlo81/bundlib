import { cosmiconfig } from 'cosmiconfig';
import { resolve } from 'path';
import slash from 'slash';
import { BundlibOptions } from './bundlib-options';
import { PRODUCT_NAME } from './consts';
import { isString } from './type-check';

const searchPlaces = ['', '.json', '.yaml', '.yml', '.js'].map((ext) => `.${PRODUCT_NAME}rc${ext}`)
  .concat(`${PRODUCT_NAME}.config.js`);

export async function loadOptions(cwd: string, options: BundlibOptions | string | null | undefined): Promise<BundlibOptions | null | undefined> {

  const manager = cosmiconfig(PRODUCT_NAME, {
    searchPlaces,
  });

  if (options) {

    if (!isString(options)) {
      return options;
    }

    const filename = resolve(cwd, options);
    const data = await manager.load(filename);

    if (!data) {
      throw new Error(`Unknown error loading ${slash(filename)}.`);
    }

    return data.config as BundlibOptions;

  }

  const data = await manager.search();

  if (!data) {
    throw new Error('Unknown error loading options.');
  }

  return data.config as BundlibOptions | null | undefined;

}
