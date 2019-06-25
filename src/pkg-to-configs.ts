import builtinModules from "builtin-modules";
import { dirname, extname, join as joinPath } from "path";
import { Plugin, RollupOptions } from "rollup";

import { createBrowserConfig, createModuleConfig } from "./create-config";
import { AnalizedPkg } from "./pkg-analized";
import renameMin from "./rename-min";
import resolve from "./resolve";

import babel from "rollup-plugin-babel";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import exportEquals from "rollup-plugin-export-equals";
import json from "rollup-plugin-json";
import nodeResolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import ts2 from "rollup-plugin-typescript2";

function pkgToConfigs(pkg: AnalizedPkg, dev?: boolean): RollupOptions[];
function pkgToConfigs(
  {
    cwd,
    input: apiInput,
    output,
    sourcemap,
    minify,
    dependencies,
    browser: browserOptions,
    options,
    cache: cacheFolder,
  }: AnalizedPkg,
  dev?: boolean,
): RollupOptions[] {

  const {
    main: cjsOutputFile,
    module: esOutputFile,
    browser: browserOutputFile,
    types: typesOutputFile,
  } = output;

  const {
    runtime: runtimeDependencies,
    peer: peerDependencies,
  } = dependencies;

  const {
    esModule,
    interop,
    extend,
    equals,
  } = options;

  const {
    format: browserFormat,
    name: pkgName,
    id,
    globals,
  } = browserOptions;

  const nameNeeded = browserOutputFile && (browserFormat === "iife" || browserFormat === "umd");

  if (nameNeeded && !pkgName) {
    throw new Error("name option is required for IIFE and UMD builds");
  }

  const prod = !dev;

  const apiFolder = dirname(apiInput);
  const sourcemapBool = !!sourcemap;

  const configs: RollupOptions[] = [];

  let typesOutputDir = typesOutputFile;
  if (typesOutputDir && extname(typesOutputDir) === ".ts") {
    typesOutputDir = dirname(typesOutputDir);
  }

  const modulePlugins = (mini: boolean): Array<Plugin | null | false> => {

    const declarationDir = !configs.length && typesOutputDir;
    const srcFolderContent = resolve("**/*.ts", apiFolder);

    const cacheRoot = joinPath(cacheFolder, "rpt2");

    return [

      ts2({
        include: srcFolderContent,
        cacheRoot,
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
            sourceMap: sourcemapBool,
            declaration: !!declarationDir,
            declarationDir: declarationDir || "",
            emitDeclarationOnly: false,
          },
        },
      }),

      json() as Plugin,

      declarationDir && equals ? exportEquals({
        file: resolve(joinPath(declarationDir, "index.d.ts"), cwd),
      }) : null,

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
        sourcemap: sourcemapBool,
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
    ...builtinModules,
    ...runtimeDependencies,
    ...peerDependencies,
  ];

  if (esOutputFile) {

    configs.push(
      createModuleConfig(
        apiInput,
        "es",
        esOutputFile,
        sourcemap,
        true,
        false,
        external,
        modulePlugins(prod && !minify.module),
      ),
    );

    if (minify.module) {

      configs.push(
        createModuleConfig(
          apiInput,
          "es",
          renameMin(esOutputFile),
          sourcemap,
          true,
          false,
          external,
          modulePlugins(true),
        ),
      );

    }

  }

  if (cjsOutputFile) {

    configs.push(
      createModuleConfig(
        apiInput,
        "cjs",
        cjsOutputFile,
        sourcemap,
        esModule,
        interop,
        external,
        modulePlugins(prod && !minify.main),
      ),
    );

    if (minify.main) {

      configs.push(
        createModuleConfig(
          apiInput,
          "cjs",
          renameMin(cjsOutputFile),
          sourcemap,
          esModule,
          interop,
          external,
          modulePlugins(true),
        ),
      );

    }

  }

  if (browserOutputFile) {

    configs.push(
      createBrowserConfig(
        apiInput,
        browserFormat,
        browserOutputFile,
        sourcemap,
        esModule,
        interop,
        browserPlugins(prod && !minify.browser),
        pkgName as string,
        extend,
        globals,
        id,
      ),
    );

    if (minify.browser) {

      configs.push(
        createBrowserConfig(
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
        ),
      );

    }

  }

  return configs;

}

export default pkgToConfigs;
