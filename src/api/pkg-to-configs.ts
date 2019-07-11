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
import { PkgAnalized } from "./pkg-analized";
import { renameMin, renamePre } from "./rename";
import { BundlibRollupOptions, FilterablePlugins, RollupSourcemap } from "./types";

async function pkgToConfigs(pkg: PkgAnalized, dev?: boolean): Promise<BundlibRollupOptions[]>;
async function pkgToConfigs(
  {
    cwd,
    input,
    dependencies,
    cache,
    output,
  }: PkgAnalized,
  dev?: boolean,
): Promise<BundlibRollupOptions[]> {

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

  const extensions = [".ts", ".js"];
  const exclude = /node_modules/;

  const configs: BundlibRollupOptions[] = [];

  function createPlugins(browser: boolean, mini: boolean, sourcemap: RollupSourcemap, bin?: string): FilterablePlugins {

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

      bin && cjsOutput && {

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
        // typescript: require("typescript"),
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
        createPlugins(false, production && !esOutput.min, esOutput.sourcemap),
        true,
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
          createPlugins(false, true, esOutput.sourcemap),
          true,
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
        createPlugins(false, production && !cjsOutput.min, cjsOutput.sourcemap),
        true,
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
          createPlugins(false, true, cjsOutput.sourcemap),
          true,
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
        createPlugins(true, production && !browserOutput.min, browserOutput.sourcemap),
        true,
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
          createPlugins(true, true, browserOutput.sourcemap),
          true,
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
        createPlugins(false, production, binaryOutput.sourcemap, binaryOutput.path),
        true,
      ),
    );

  }

  return configs;

}

export default pkgToConfigs;
