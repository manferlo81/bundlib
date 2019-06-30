import { BundlibBuildFormat, BundlibRollupOutputOptions, OutputExtra, RollupSourcemap } from "./types";

export function createOutput<E extends OutputExtra>(
  format: BundlibBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  extra?: E,
): BundlibRollupOutputOptions & E {

  return Object.assign({

    file,
    format,

    sourcemap,
    esModule,
    interop,

  }, extra);

}

export default createOutput;
