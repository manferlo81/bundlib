import { PluginImpl, OutputOptions } from "rollup";

declare interface ParseOptions {
  bare_returns?: boolean;
  ecma?: 5 | 6 | 7 | 8;
  html5_comments?: boolean;
  shebang?: boolean;
}

declare interface CompressOptions {
  arrows?: boolean;
  arguments?: boolean;
  booleans?: boolean;
  booleans_as_integers?: boolean;
  collapse_vars?: boolean;
  comparisons?: boolean;
  computed_props?: boolean;
  conditionals?: boolean;
  dead_code?: boolean;
  defaults?: boolean;
  directives?: boolean;
  drop_console?: boolean;
  drop_debugger?: boolean;
  ecma?: 5 | 6;
  evaluate?: boolean;
  expression?: boolean;
  global_defs?: Record<string, any>,
  hoist_funs?: boolean;
  hoist_props?: boolean;
  hoist_vars?: boolean;
  if_return?: boolean;
  inline?: boolean | 0 | 1 | 2 | 3;
  join_vars?: boolean;
  keep_classnames?: boolean;
  keep_fargs?: boolean;
  keep_fnames?: boolean;
  keep_infinity?: boolean;
  loops?: boolean;
  module?: boolean;
  negate_iife?: boolean;
  passes?: number;
  properties?: boolean;
  pure_funcs?: string[] | null;
  pure_getters?: boolean | "strict";
  reduce_funcs?: boolean;
  reduce_vars?: boolean;
  side_effects?: boolean;
  switches?: boolean;
  toplevel?: boolean;
  top_retain?: unknown;
  typeofs?: boolean;
  unsafe?: boolean;
  unsafe_comps?: boolean;
  unsafe_Function?: boolean;
  unsafe_math?: boolean;
  unsafe_methods?: boolean;
  unsafe_proto?: boolean;
  unsafe_regexp?: boolean;
  unsafe_undefined?: boolean;
  unused?: boolean | "keep_assign";
  warnings?: boolean;
}

declare interface MangleOptions {
  eval?: boolean;
  keep_classnames?: boolean;
  keep_fnames?: boolean;
  module?: boolean;
  reserved?: string[];
  toplevel?: boolean;
  safari10?: boolean;
}

declare interface TerserOutputOptions {
  beautify?: boolean;
  braces?: boolean;
  comments?: boolean | "all" | "some" | RegExp;
  ecma?: 5 | 6;
  indent_level?: number;
  indent_start?: number;
  inline_script?: boolean;
  keep_quoted_props?: boolean;
  max_line_len?: number;
  preamble?: string | null;
  quote_keys?: boolean;
  quote_style?: 0 | 1 | 2 | 3;
  safari10?: boolean;
  semicolons?: boolean;
  shebang?: boolean;
  webkit?: boolean;
  wrap_iife?: boolean;
}

declare interface TerserMinifyOptions {
  ecma?: 5 | 6 | 7 | 8;
  warnings?: boolean;
  parse?: ParseOptions | boolean;
  compress?: CompressOptions | boolean;
  mangle?: MangleOptions | boolean;
  module?: boolean;
  output?: TerserOutputOptions | null;
  toplevel?: boolean;
  nameCache?: Object | null;
  ie8?: boolean;
  keep_classnames?: boolean | RegExp;
  keep_fnames?: boolean | RegExp;
  safari10?: boolean;
}

declare interface TerserPluginOptions extends TerserMinifyOptions {
  sourcemap?: boolean,
  numWorkers?: number;
}

export const terser: PluginImpl<TerserPluginOptions>;
