import { PluginImpl } from "rollup";

declare type MinimatchPattern = Array<string | RegExp> | string | RegExp | null;

declare interface BabelPluginOptions {
  extensions?: string[],
  include?: MinimatchPattern,
  exclude?: MinimatchPattern,
  babelrc?: boolean,
  presets?: any[],
  plugins?: any[],
  runtimeHelpers?: boolean
}

declare const babel: PluginImpl<BabelPluginOptions>;

export default babel;
