import { BundlibBuildFormat, BundlibRollupOutputOptions, OutputExtra, RollupSourcemap } from "./types";

export function createOutput(
  format: BundlibBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  extra?: OutputExtra,
): BundlibRollupOutputOptions {

  return Object.assign({

    file,
    format,

    sourcemap,
    esModule,
    interop,

  }, extra);

}

export default createOutput;
