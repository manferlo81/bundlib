import { ModuleFormat, OutputOptions as RollupOutputOptions, Plugin, RollupOptions } from "rollup";

export type Some<T, X extends T> = Exclude<T, Exclude<T, X>>;
export type Extra<T, X extends keyof T> = Pick<T, Exclude<keyof T, X>>;

export type OutputExtra = Extra<
  RollupOutputOptions,
  "file" | "format" | "sourcemap" | "esModule" | "interop"
>;

export type FilterablePlugins = Array<Plugin | null | false>;
export type ConfigExtra = Extra<
  RollupOptions,
  "input" | "output" | "external" | "plugins"
>;

export type BuildFormat = Some<ModuleFormat, "cjs" | "es" | "iife" | "amd" | "umd">;

export interface BundlibOptions {

  /**
   * makes bundlib build a development bundle
   * @default false
   */
  dev?: boolean;

  /**
   * makes bundlib to run in watch mode
   * @default false
   */
  watch?: boolean;

}

// export interface BundlibPkgOutput {
//   cjs: string | null;
//   es: string | null;
//   iife: string | null;
//   amd: string | null;
//   umd: string | null;
//   types: string | null;
// }

// export interface BundlibDependencies {
//   builtin: string[];
//   runtime: string[];
//   peer: string[];
//   bundled: string[];
// }

// export interface BundlibPkg {

//   /**
//    * the current working directory
//    */
//   cwd: string;

//   /**
//    * the original package.json
//    */
//   pkg: Pkg;

//   /**
//    * dependencies
//    */
//   dependencies: BundlibDependencies;

//   /**
//    *
//    */
//   input: string;

//   /**
//    */
//   output: BundlibPkgOutput;

//   /**
//    * bundlib options, extracted from package.josn then normalized
//    */
//   options: BundlibOutputOptions;

// }
