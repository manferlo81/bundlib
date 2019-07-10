import builtinModules from "builtin-modules";
import { union } from "lodash";
import { basename, dirname, extname, join as pathJoin, relative, resolve } from "path";
import { Plugin } from "rollup";

import addShebang from "rollup-plugin-add-shebang";
import babel from "rollup-plugin-babel";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import exportEquals from "rollup-plugin-export-equals";
import json from "rollup-plugin-json";
import nodeResolve from "rollup-plugin-node-resolve";
import stripShebang from "rollup-plugin-strip-shebang";
import { terser } from "rollup-plugin-terser";
import typescript2 from "rollup-plugin-typescript2";

import { createBrowserConfig, createModuleConfig } from "./create-config";
import { error, noTsInput } from "./errors";
import { PkgAnalized10 } from "./pkg-analized";
import { renameMin, renamePre } from "./rename";
import { BundlibRollupOptions, FilterablePlugins } from "./types";

function pkgToConfigs(pkg: PkgAnalized10, dev?: boolean): BundlibRollupOptions[];
function pkgToConfigs(
  {
    cwd,
    input: inputObject,
    dependencies,
    cache: cacheFolder,
    output: output10,
  }: PkgAnalized10,
  dev?: boolean,
): BundlibRollupOptions[] {

  const {
    api: apiInput,
    bin: binInput,
  } = inputObject;

  const {
    main: cjsOutputInfo,
    module: esOutputInfo,
    browser: browserOutputInfo,
    bin: binaryOutputInfo,
    types: typesOutputInfo,
  } = output10;

  if (
    (cjsOutputInfo || esOutputInfo || browserOutputInfo) &&
    extname(apiInput) !== ".ts"
  ) {
    throw noTsInput("Module");
  }

  if (
    binaryOutputInfo &&
    extname(binInput) !== ".ts"
  ) {
    throw noTsInput("Binary");
  }

  const {
    runtime: runtimeDeps,
    peer: peerDeps,
    optional: optionalDeps,
  } = dependencies;

  if (
    browserOutputInfo &&
    (browserOutputInfo.format === "iife" || browserOutputInfo.format === "umd") &&
    !browserOutputInfo.name
  ) {
    throw error("name option is required for IIFE and UMD builds");
  }

  const production = !dev;

  const apiFolder = dirname(apiInput);
  const apiFolderContent = resolve(apiFolder, "**/*.ts");
  const cwdFolderContent = resolve(cwd, "**/*.ts");

  const typesFilename = renamePre(basename(apiInput), "d");

  let typesOutputDir = typesOutputInfo ? typesOutputInfo.path : null;
  if (typesOutputDir && extname(typesOutputDir) === ".ts") {
    typesOutputDir = dirname(typesOutputDir);
  }

  const external = union(runtimeDeps, peerDeps, optionalDeps, builtinModules);

  const extensions = [".ts", ".js"];
  const exclude = /node_modules/;

  const configs: BundlibRollupOptions[] = [];

  function createPlugins(browser: boolean, mini: boolean, sourcemapBool: boolean, bin?: string): FilterablePlugins {

    const declarationDir = !configs.length && !bin && typesOutputDir;
    const tsInclude = bin ? [cwdFolderContent] : [apiFolderContent];
    const cacheRoot = pathJoin(cacheFolder, "rpt2");

    let shebang: string;

    return [

      bin && stripShebang({
        capture: (shebangFromFile) => shebang = shebangFromFile,
        sourcemap: sourcemapBool,
      }),

      bin && cjsOutputInfo && {

        name: "api",

        resolveId(moduleId, from) {

          const resolved = !from ? moduleId : pathJoin(dirname(from), moduleId);

          if (
            resolved === apiInput ||
            pathJoin(resolved, ".ts") === apiInput ||
            pathJoin(resolved, "/index.ts") === apiInput
          ) {
            return {
              id: relative(
                dirname(bin),
                cwd,
              ),
              external: true,
              moduleSideEffects: false,
            };
          }

          return null;

        },

      },

      browser && nodeResolve({
        preferBuiltins: !browser,
        extensions,
      }),

      browser && commonjs({
        sourceMap: sourcemapBool,
      }),

      typescript2({
        include: tsInclude,
        cacheRoot,
        useTsconfigDeclarationDir: true,
        tsconfigDefaults: {
          include: tsInclude,
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

      declarationDir && typesOutputInfo && typesOutputInfo.equals && exportEquals({
        file: resolve(cwd, pathJoin(declarationDir, typesFilename)),
      }),

      babel({
        extensions,
        exclude,
        babelrc: false,
        plugins: [require.resolve("babel-plugin-transform-async-to-promises")],
      }),

      buble({
        exclude,
        target: {
          node: 0.12,
        },
        objectAssign: true,
      }) as Plugin,

      bin && addShebang({
        include: bin,
        shebang: () => shebang,
      }),

      mini && terser({
        sourcemap: sourcemapBool,
        toplevel: true,
        module: true,
      }),

    ];

  }

  if (esOutputInfo) {

    configs.push(
      createModuleConfig(
        apiInput,
        "es",
        esOutputInfo.file,
        esOutputInfo.sourcemap,
        true,
        false,
        external,
        createPlugins(false, production && !esOutputInfo.min, !!esOutputInfo.sourcemap),
        true,
      ),
    );

    if (esOutputInfo.min) {

      configs.push(
        createModuleConfig(
          apiInput,
          "es",
          renameMin(esOutputInfo.file),
          esOutputInfo.sourcemap,
          true,
          false,
          external,
          createPlugins(false, true, !!esOutputInfo.sourcemap),
          true,
        ),
      );

    }

  }

  if (cjsOutputInfo) {

    configs.push(
      createModuleConfig(
        apiInput,
        "cjs",
        cjsOutputInfo.file,
        cjsOutputInfo.sourcemap,
        cjsOutputInfo.esModule,
        cjsOutputInfo.interop,
        external,
        createPlugins(false, production && !cjsOutputInfo.min, !!cjsOutputInfo.sourcemap),
        true,
      ),
    );

    if (cjsOutputInfo.min) {

      configs.push(
        createModuleConfig(
          apiInput,
          "cjs",
          renameMin(cjsOutputInfo.file),
          cjsOutputInfo.sourcemap,
          cjsOutputInfo.esModule,
          cjsOutputInfo.interop,
          external,
          createPlugins(false, true, !!cjsOutputInfo.sourcemap),
          true,
        ),
      );

    }

  }

  if (browserOutputInfo) {

    configs.push(
      createBrowserConfig(
        apiInput,
        browserOutputInfo.format,
        browserOutputInfo.file,
        browserOutputInfo.sourcemap,
        browserOutputInfo.esModule,
        browserOutputInfo.interop,
        createPlugins(true, production && !browserOutputInfo.min, !!browserOutputInfo.sourcemap),
        true,
        browserOutputInfo.name as string,
        browserOutputInfo.extend,
        browserOutputInfo.globals,
        browserOutputInfo.id,
      ),
    );

    if (browserOutputInfo.min) {

      configs.push(
        createBrowserConfig(
          apiInput,
          browserOutputInfo.format,
          renameMin(browserOutputInfo.file),
          browserOutputInfo.sourcemap,
          browserOutputInfo.esModule,
          browserOutputInfo.interop,
          createPlugins(true, true, !!browserOutputInfo.sourcemap),
          true,
          browserOutputInfo.name as string,
          browserOutputInfo.extend,
          browserOutputInfo.globals,
          browserOutputInfo.id,
        ),
      );

    }

  }

  if (binaryOutputInfo) {

    configs.push(
      createModuleConfig(
        binInput,
        "cjs",
        binaryOutputInfo.file,
        binaryOutputInfo.sourcemap,
        binaryOutputInfo.esModule,
        binaryOutputInfo.interop,
        external,
        createPlugins(false, production, !!binaryOutputInfo.sourcemap, binaryOutputInfo.file),
        true,
      ),
    );

  }

  return configs;

}

export default pkgToConfigs;
