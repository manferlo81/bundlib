import builtinModules from "builtin-modules";
import { basename, dirname, extname, join as pathJoin, relative, resolve } from "path";
import { Plugin, RollupOptions } from "rollup";

import { createBrowserConfig, createModuleConfig } from "./create-config";
import { AnalizedPkg } from "./pkg-analized";
import { renameMin, renamePre } from "./rename";

import addShebang from "rollup-plugin-add-shebang";
import babel from "rollup-plugin-babel";
import buble from "rollup-plugin-buble";
import commonjs from "rollup-plugin-commonjs";
import exportEquals from "rollup-plugin-export-equals";
import json from "rollup-plugin-json";
import nodeResolve from "rollup-plugin-node-resolve";
import stripShebang from "rollup-plugin-strip-shebang";
import { terser } from "rollup-plugin-terser";
import ts2 from "rollup-plugin-typescript2";
import resolveId from "./resolve-id";

function pkgToConfigs(pkg: AnalizedPkg, dev?: boolean): RollupOptions[];
function pkgToConfigs(
  {
    cwd,
    input: inputObject,
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
    api: apiInput,
    bin: cliInput,
  } = inputObject;

  const {
    main: cjsOutputFile,
    module: esOutputFile,
    browser: browserOutputFile,
    bin: binaryOutputFile,
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

  const buildApi = !!(esOutputFile || cjsOutputFile || browserOutputFile);

  const apiFolder = dirname(apiInput);
  const cliFolder = dirname(cliInput);

  const apiFolderContent = resolve(apiFolder, "**/*.ts");
  const cliFolderContent = resolve(cliFolder, "**/*.ts");

  const typesFilename = renamePre(basename(apiInput), "d");
  const sourcemapBool = !!sourcemap;

  let typesOutputDir = typesOutputFile;
  if (typesOutputDir && extname(typesOutputDir) === ".ts") {
    typesOutputDir = dirname(typesOutputDir);
  }

  const extensions = [".ts", ".js"];
  const exclude = /node_modules/;

  const configs: RollupOptions[] = [];

  function createPlugins(browser: boolean, mini: boolean, bin?: string): Array<Plugin | null | false> {

    const declarationDir = !configs.length && !bin && typesOutputDir;
    const include = buildApi
      ? [bin ? cliFolderContent : apiFolderContent]
      : [cliFolderContent, apiFolderContent];
    const cacheRoot = pathJoin(cacheFolder, "rpt2");

    let shebang: string;

    return [

      !!bin && stripShebang({
        capture: (shebangFromFile) => shebang = shebangFromFile,
        sourcemap: sourcemapBool,
      }),

      !!bin && buildApi && {

        name: "api",

        resolveId(moduleId, from) {

          const resolved = resolveId(moduleId, cwd, from);

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
      // !!bin && buildApi && mapId({
      //   cwd,
      //   map: {
      //     [apiInput]: {
      //       id: cwd,
      //       external: true,
      //     },
      //   },
      // }),

      browser && nodeResolve({
        preferBuiltins: false,
        extensions,
      }),

      browser && commonjs({
        sourceMap: sourcemapBool,
      }),

      ts2({
        include,
        cacheRoot,
        useTsconfigDeclarationDir: true,
        tsconfigDefaults: {
          include,
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

      !!declarationDir && equals && exportEquals({
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

      !!bin && addShebang({
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
        createPlugins(false, prod && !minify.module),
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
          createPlugins(false, true),
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
        createPlugins(false, prod && !minify.main),
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
          createPlugins(false, true),
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
        createPlugins(true, prod && !minify.browser),
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
          createPlugins(true, true),
          pkgName as string,
          extend,
          globals,
          id,
        ),
      );

    }

  }

  if (binaryOutputFile) {

    configs.push(
      createModuleConfig(
        cliInput,
        "cjs",
        binaryOutputFile,
        sourcemap,
        esModule,
        interop,
        external,
        createPlugins(false, prod, binaryOutputFile),
      ),
    );

  }

  return configs;

}

export default pkgToConfigs;
