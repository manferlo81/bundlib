import builtinModules from "builtin-modules";
import { union } from "lodash";
import { basename, dirname, extname, join as pathJoin, resolve } from "path";
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

import mapIdExternal from "./api-plugin";
import { createBrowserConfig, createModuleConfig } from "./create-config";
import { error, noTsInput } from "./errors";
import { setProp } from "./helpers";
import keysOrNull from "./keys-or-null";
import { PkgAnalized } from "./pkg-analized";
import { renameMin, renamePre } from "./rename";
import {
  BundlibAPIOptions,
  BundlibRollupModuleOutputOptions,
  BundlibRollupOptions,
  FilterablePlugins,
  RollupSourcemap,
} from "./types";

async function pkgToConfigs(
  pkg: PkgAnalized,
  options: BundlibAPIOptions,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>>;

async function pkgToConfigs(
  { cwd, pkg, input, dependencies, cache, output }: PkgAnalized,
  { dev, watch }: BundlibAPIOptions,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>> {

  const {
    api: apiInput,
    bin: binInput,
  } = input;

  const {
    main: cjsOutput,
    module: esOutput,
    browser: browserOutput,
    bin: binaryOutput,
    types: typesOutput,
  } = output;

  if (
    (cjsOutput || esOutput || browserOutput) &&
    extname(apiInput) !== ".ts"
  ) {
    throw noTsInput("Module");
  }

  if (
    binaryOutput &&
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
    browserOutput &&
    (browserOutput.format === "iife" || browserOutput.format === "umd") &&
    !browserOutput.name
  ) {
    throw error("name option is required for IIFE and UMD builds");
  }

  const production = !dev;

  const apiFolder = dirname(apiInput);
  const apiFolderContent = resolve(apiFolder, "**/*.ts");
  const cwdFolderContent = resolve(cwd, "**/*.ts");

  const typesFilename = renamePre(basename(apiInput), "d");

  let typesOutputDir = typesOutput ? typesOutput.path : null;
  if (typesOutputDir && extname(typesOutputDir) === ".ts") {
    typesOutputDir = dirname(typesOutputDir);
  }

  const external = union(runtimeDeps, peerDeps, optionalDeps, builtinModules);

  const installedDeps = union(runtimeDeps, keysOrNull(pkg.devDependencies));

  const useUserTypescript = installedDeps.indexOf("typescript") >= 0;
  const useChokidar = !!watch && installedDeps.indexOf("chokidar") >= 0;

  let typescript = useUserTypescript
    ? null
    : await import("typescript");

  const extensions = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".node"];
  const exclude = /node_modules/;

  const configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>> = [];

  function createPlugins(
    outputFile: string | null,
    sourcemap: RollupSourcemap,
    mini: boolean,
    browser: boolean,
    bin: boolean,
  ): FilterablePlugins {

    const sourcemapBool = !!sourcemap;

    const declarationDir = !configs.length && !bin && typesOutputDir;
    const tsInclude = bin ? [cwdFolderContent] : [apiFolderContent];
    const cacheRoot = pathJoin(cache, "rpt2");

    let shebang: string;

    return [

      bin && stripShebang({
        capture: (shebangFromFile) => shebang = shebangFromFile,
        sourcemap: sourcemapBool,
      }),

      bin && cjsOutput && outputFile && mapIdExternal(
        cwd,
        dirname(outputFile),
        setProp(apiInput, cwd, {}),
      ),

      nodeResolve({
        preferBuiltins: !browser,
        extensions,
      }),

      browser && commonjs({
        sourceMap: sourcemapBool,
      }),

      typescript2({
        typescript: typescript = typescript || require(require.resolve("typescript", {
          paths: [cwd],
        })),
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

      declarationDir && typesOutput && typesOutput.equals && exportEquals({
        file: resolve(cwd, pathJoin(declarationDir, typesFilename)),
      }),

      babel({
        extensions,
        exclude,
        babelrc: false,
        plugins: [
          require.resolve("@babel/plugin-syntax-dynamic-import"),
          require.resolve("babel-plugin-transform-async-to-promises"),
        ],
      }),

      buble({
        exclude,
        target: {
          node: 0.12,
        },
        objectAssign: true,
      }) as Plugin,

      bin && outputFile && addShebang({
        include: outputFile,
        shebang: () => shebang || "#!/usr/bin/env node",
      }),

      mini && terser({
        sourcemap: sourcemapBool,
        toplevel: true,
        module: true,
      }),

    ];

  }

  if (esOutput) {

    configs.push(
      createModuleConfig(
        apiInput,
        "es",
        esOutput.path,
        esOutput.sourcemap,
        true,
        false,
        external,
        createPlugins(
          esOutput.path,
          esOutput.sourcemap,
          production && !esOutput.min,
          false,
          false,
        ),
        useChokidar,
      ),
    );

    if (esOutput.min) {

      configs.push(
        createModuleConfig(
          apiInput,
          "es",
          renameMin(esOutput.path),
          esOutput.sourcemap,
          true,
          false,
          external,
          createPlugins(
            esOutput.path,
            esOutput.sourcemap,
            true,
            false,
            false,
          ),
          useChokidar,
        ),
      );

    }

  }

  if (cjsOutput) {

    configs.push(
      createModuleConfig(
        apiInput,
        "cjs",
        cjsOutput.path,
        cjsOutput.sourcemap,
        cjsOutput.esModule,
        cjsOutput.interop,
        external,
        createPlugins(
          cjsOutput.path,
          cjsOutput.sourcemap,
          production && !cjsOutput.min,
          false,
          false,
        ),
        useChokidar,
      ),
    );

    if (cjsOutput.min) {

      configs.push(
        createModuleConfig(
          apiInput,
          "cjs",
          renameMin(cjsOutput.path),
          cjsOutput.sourcemap,
          cjsOutput.esModule,
          cjsOutput.interop,
          external,
          createPlugins(
            cjsOutput.path,
            cjsOutput.sourcemap,
            true,
            false,
            false,
          ),
          useChokidar,
        ),
      );

    }

  }

  if (browserOutput) {

    configs.push(
      createBrowserConfig(
        apiInput,
        browserOutput.format,
        browserOutput.path,
        browserOutput.sourcemap,
        browserOutput.esModule,
        browserOutput.interop,
        createPlugins(
          null,
          browserOutput.sourcemap,
          production && !browserOutput.min,
          true,
          false,
        ),
        useChokidar,
        browserOutput.name as string,
        browserOutput.extend,
        browserOutput.globals,
        browserOutput.id,
      ),
    );

    if (browserOutput.min) {

      configs.push(
        createBrowserConfig(
          apiInput,
          browserOutput.format,
          renameMin(browserOutput.path),
          browserOutput.sourcemap,
          browserOutput.esModule,
          browserOutput.interop,
          createPlugins(
            null,
            browserOutput.sourcemap,
            true,
            true,
            false,
          ),
          useChokidar,
          browserOutput.name as string,
          browserOutput.extend,
          browserOutput.globals,
          browserOutput.id,
        ),
      );

    }

  }

  if (binaryOutput) {

    configs.push(
      createModuleConfig(
        binInput,
        "cjs",
        binaryOutput.path,
        binaryOutput.sourcemap,
        binaryOutput.esModule,
        binaryOutput.interop,
        external,
        createPlugins(
          binaryOutput.path,
          binaryOutput.sourcemap,
          production && !binaryOutput.min,
          false,
          true,
        ),
        useChokidar,
      ),
    );

    if (binaryOutput.min) {

      configs.push(
        createModuleConfig(
          binInput,
          "cjs",
          renameMin(binaryOutput.path),
          binaryOutput.sourcemap,
          binaryOutput.esModule,
          binaryOutput.interop,
          external,
          createPlugins(
            binaryOutput.path,
            binaryOutput.sourcemap,
            true,
            false,
            true,
          ),
          useChokidar,
        ),
      );

    }

  }

  return configs;

}

export default pkgToConfigs;
