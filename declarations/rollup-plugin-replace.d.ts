import { PluginImpl } from "rollup";

declare interface ReplacePluginOptions {
  delimiters?: ArrayLike<string>;
  values?: Record<string, string>;
  sourcemap?: boolean;
}

declare const replace: PluginImpl<ReplacePluginOptions>;

export default replace;
