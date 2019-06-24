import { OutputOptions as RollupOutputOptions } from "rollup";

import { BundlibBuildFormat, OutputExtra, RollupSourcemap } from "./types";

export function createOutput(
  format: BundlibBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  extra?: OutputExtra,
): RollupOutputOptions {

  const output: RollupOutputOptions = {

    file,
    format,

    sourcemap,
    esModule,
    interop,

    ...extra,

  };

  return output;

}

export default createOutput;
