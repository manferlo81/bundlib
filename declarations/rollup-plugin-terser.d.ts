import { PluginImpl } from "rollup";

declare interface TerserOptions {
  sourcemap?: boolean,
  toplevel?: boolean,
  module?: boolean,
}

export const terser: PluginImpl<TerserOptions>;
