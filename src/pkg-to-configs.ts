import { dirname, extname, join as joinPath } from "path";
import { Plugin, RollupOptions } from "rollup";

import { createBrowserConfig, createModuleConfig } from "./create-config";
import { AnalizedPkg } from "./pkg";
import renameMin from "./rename-min";
import resolvePath from "./resolve";
import { BundlibOptions } from "./types";

import babel from "rollup-plugin-babel";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import exportEquals from "rollup-plugin-export-equals";
import json from "rollup-plugin-json";
import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import ts2 from "rollup-plugin-typescript2";

const pkgToConfigs = (
  {
    cwd,
    input: apiInput,
    output,
    minify,
    dependencies,
    options,
  }: AnalizedPkg,
  { dev }: BundlibOptions = {},
): RollupOptions[] => {

  const apiFolder = dirname(apiInput);

  const {
    cjs: cjsOutputFile,
    es: esOutputFile,
    browser: browserOutputFile,
    types: typesOutputFile,
  } = output;

  const {
    builtin: builtinDependencies,
    runtime: runtimeDependencies,
    peer: peerDependencies,
  } = dependencies;

  const {

    sourcemap,
    esModule,
    interop,
    extend,
    equals,

    browser: browserFormat,
    name: pkgName,
    id,
    globals,

  } = options;

  const prod = !dev;

  const configs: RollupOptions[] = [];

  let typesOutputDir = typesOutputFile;
  if (typesOutputDir && extname(typesOutputDir) === ".ts") {
    typesOutputDir = dirname(typesOutputDir);
  }

  const modulePlugins = (mini: boolean): Array<Plugin | null | false> => {

    const declarationDir = !configs.length && typesOutputDir;
    const srcFolderContent = resolvePath("**/*.ts", apiFolder);

    return [

      ts2({
        include: srcFolderContent,
        cacheRoot: resolvePath(".cache/rpt2", cwd),
        useTsconfigDeclarationDir: true,
        tsconfigDefaults: {
          include: [
            srcFolderContent,
          ],
          exclude: [],
        },
        tsconfigOverride: {
          compilerOptions: {
            target: "esnext",
            module: "esnext",
            moduleResolution: "node",
            sourceMap: sourcemap,
            declaration: !!declarationDir,
            declarationDir: declarationDir || "",
            emitDeclarationOnly: false,
          },
        },
      }),

      json() as Plugin,

      declarationDir && equals && exportEquals({
        file: resolvePath(joinPath(declarationDir, "index.d.ts"), cwd),
      }) || null,

      babel({
        extensions: [".ts", ".js"],
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

      mini && terser({
        sourcemap,
        toplevel: true,
        module: true,
      }),

    ];

  };

  const browserPlugins = (mini: boolean) => [

    nodeResolve(),
    commonjs(),

    ...modulePlugins(mini),

  ];

  const external = [
    ...builtinDependencies,
    ...runtimeDependencies,
    ...peerDependencies,
  ];

  if (esOutputFile) {

    const config: RollupOptions = createModuleConfig(
      apiInput,
      "es",
      esOutputFile,
      sourcemap,
      true,
      false,
      external,
      modulePlugins(prod),
    );

    configs.push(config);

    if (minify.module) {

      const configMin: RollupOptions = createModuleConfig(
        apiInput,
        "es",
        renameMin(esOutputFile),
        sourcemap,
        true,
        false,
        external,
        modulePlugins(true),
      );

      configs.push(configMin);

    }

  }

  if (cjsOutputFile) {

    const config: RollupOptions = createModuleConfig(
      apiInput,
      "cjs",
      cjsOutputFile,
      sourcemap,
      esModule,
      interop,
      external,
      modulePlugins(prod),
    );

    configs.push(config);

    if (minify.main) {

      const configMin: RollupOptions = createModuleConfig(
        apiInput,
        "cjs",
        renameMin(cjsOutputFile),
        sourcemap,
        esModule,
        interop,
        external,
        modulePlugins(true),
      );

      configs.push(configMin);

    }

  }

  if (!pkgName && browserOutputFile) {
    throw new Error("name option is required for IIFE and UMD builds");
  }

  if (browserOutputFile) {

    const config = createBrowserConfig(
      apiInput,
      browserFormat,
      browserOutputFile,
      sourcemap,
      esModule,
      interop,
      browserPlugins(prod),
      pkgName as string,
      extend,
      globals,
      id,
    );

    configs.push(config);

    if (minify.browser) {

      const configMin = createBrowserConfig(
        apiInput,
        browserFormat,
        renameMin(browserOutputFile),
        sourcemap,
        esModule,
        interop,
        browserPlugins(true),
        pkgName as string,
        extend,
        globals,
        id,
      );

      configs.push(configMin);

    }

  }

  // if (typesOutputFile) {

  //   const config = createModuleConfig(
  //     apiInput,
  //     "es",
  //     typesOutputFile,
  //     false,
  //     false,
  //     false,
  //     external,
  //     typesPlugins(),
  //   );

  //   configs.push(config);

  // }

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
