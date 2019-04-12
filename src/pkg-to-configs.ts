import { resolve as resolvePath } from "path";
import { ExternalOption, OutputOptions as RollupOutputOptions, Plugin, RollupOptions } from "rollup";

import { BundlibPkg } from "./types";

import babel from "rollup-plugin-babel";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { createBrowserConfig, createModuleConfig } from "./create-config";
import transpile from "./plugins/transpile";
import { FilterablePlugins } from "./types";

const pkgToConfigs = ({ cwd, pkg, external, types, options }: BundlibPkg, dev: boolean): RollupOptions[] => {

  const {

    input: apiInput,

    sourcemap,
    esModule,
    interop,

    iife,
    umd,
    name,
    id,
    extend,
    globals,

  } = options;

  const configs: RollupOptions[] = [];

  const typesPath = () => !configs.length && types;

  const extensions: string[] = [".ts"];

  const transform: Plugin[] = [

    babel({
      extensions,
      exclude: /node_modules/,
      babelrc: false,
      plugins: [require.resolve("babel-plugin-transform-async-to-promises")],
    }),

    buble({
      exclude: /node_modules/,
      target: {
        node: 0.12,
      },
      objectAssign: true,
    }) as Plugin,

  ];

  const minify = !dev && terser({
    sourcemap,
    toplevel: true,
    module: true,
  });

  const modulePlugins = (): Array<Plugin | false> => [

    transpile({
      cacheRoot: resolvePath(cwd, ".cache"),
      sourcemap,
      types: typesPath(),
    }) as Plugin,

    ...transform,

    minify,

  ];

  const browserPlugins = () => [

    resolve() as Plugin,
    commonjs(),

    ...modulePlugins(),

  ];

  if (pkg.main) {

    const cjsOutputFile = resolvePath(cwd, pkg.main);

    const config: RollupOptions = createModuleConfig(
      apiInput,
      "cjs",
      cjsOutputFile,
      sourcemap,
      esModule,
      interop,
      external,
      modulePlugins(),
    );

    configs.push(config);

  }

  if (pkg.module) {

    const esmOutputFile = resolvePath(cwd, pkg.module);

    const config: RollupOptions = createModuleConfig(
      apiInput,
      "es",
      esmOutputFile,
      sourcemap,
      true,
      false,
      external,
      modulePlugins(),
    );

    configs.push(config);

  }

  if (iife) {

    const iifeOutputFile = resolvePath(cwd, iife);

    const config = createBrowserConfig(
      apiInput,
      "iife",
      iifeOutputFile,
      sourcemap,
      esModule,
      interop,
      browserPlugins(),
      name,
      extend,
      globals,
    );

    configs.push(config);

  }

  if (umd) {

    const umdOutputFile = resolvePath(cwd, umd);

    const config = createBrowserConfig(
      apiInput,
      "umd",
      umdOutputFile,
      sourcemap,
      esModule,
      interop,
      browserPlugins(),
      name,
      extend,
      globals,
      id,
    );

    configs.push(config);

  }

  // if (pkg.bin) {

  //   const file = resolvePath(cwd, pkg.bin);

  //   const output: RollupOutputOptions = {
  //     file,
  //     format: "cjs",
  //     sourcemap,
  //     esModule,
  //     interop,
  //   };

  //   const config: RollupOptions = {

  //     input: resolvePath(cwd, "src-bin/index.ts"),
  //     output,

  //     external,

  //     plugins: [

  //       stripShebang(),
  //       json() as Plugin,

  //       mapId({
  //         map: {
  //           src: apiInput,
  //           dest: "..",
  //           external: true,
  //         },
  //       }),

  //       transpile({
  //         cacheRoot: resolvePath(cwd, ".cache/api"),
  //         sourcemap,
  //         types: false,
  //       }),

  //       ...transform,

  //       minify,

  //       addShebang({
  //         include: file,
  //       }),

  //     ].filter<Plugin>(Boolean as any),

  //   };

  //   configs.push(config);

  // }

  return configs;

};

export default pkgToConfigs;
