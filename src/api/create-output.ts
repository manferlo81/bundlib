import { OutputOptions as RollupOutputOptions } from "rollup";
import { BundlibBuildFormat, BundlibRollupOutputOptions, RollupSourcemap } from "./types";

export function createOutput(
  format: BundlibBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
): BundlibRollupOutputOptions;
export function createOutput<E extends RollupOutputOptions>(
  format: BundlibBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  extra: E,
): BundlibRollupOutputOptions & E;
export function createOutput(
  format: BundlibBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  extra?: RollupOutputOptions,
): BundlibRollupOutputOptions {

  const options = {

    file,
    format,

    sourcemap,
    esModule,
    interop,

  };

  return extra ? Object.assign(options, extra) : options;

}

export default createOutput;
