import { OutputOptions as RollupOutputOptions } from "rollup";
import { BundlibBuildFormat, BundlibRollupModuleOutputOptions, RollupSourcemap } from "./types";

export function createOutput(
  format: BundlibBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
): BundlibRollupModuleOutputOptions;
export function createOutput<E extends RollupOutputOptions>(
  format: BundlibBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  extra: E,
): BundlibRollupModuleOutputOptions & E;
export function createOutput(
  format: BundlibBuildFormat,
  file: string,
  sourcemap: RollupSourcemap,
  esModule: boolean,
  interop: boolean,
  extra?: RollupOutputOptions,
): BundlibRollupModuleOutputOptions {

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
