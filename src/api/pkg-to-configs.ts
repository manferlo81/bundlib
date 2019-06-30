import builtinModules from "builtin-modules";
import { basename, dirname, extname, join as pathJoin, relative, resolve } from "path";
import { IsExternal, Plugin } from "rollup";

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
import typescript2 from "rollup-plugin-typescript2";
import { BundlibRollupOptions } from "./types";

function pkgToConfigs(pkg: AnalizedPkg, dev?: boolean): BundlibRollupOptions[];
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
): BundlibRollupOptions[] {

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

  const apiFolder = dirname(apiInput);
  const apiFolderContent = resolve(apiFolder, "**/*.ts");
  const cwdFolderContent = resolve(cwd, "**/*.ts");

  const typesFilename = renamePre(basename(apiInput), "d");
  const sourcemapBool = !!sourcemap;

  let typesOutputDir = typesOutputFile;
  if (typesOutputDir && extname(typesOutputDir) === ".ts") {
    typesOutputDir = dirname(typesOutputDir);
  }

  const extensions = [".ts", ".js"];
  const exclude = /node_modules/;

  const configs: BundlibRollupOptions[] = [];

  function createPlugins(browser: boolean, mini: boolean, bin?: string): Array<Plugin | null | false> {

    const declarationDir = !configs.length && !bin && typesOutputDir;
    const tsInclude = bin ? [cwdFolderContent] : [apiFolderContent];
    const cacheRoot = pathJoin(cacheFolder, "rpt2");

    let shebang: string;

    return [

      !!bin && stripShebang({
        capture: (shebangFromFile) => shebang = shebangFromFile,
        sourcemap: sourcemapBool,
      }),

      !!bin && !!cjsOutputFile && {

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

  const externalModuleCache: Record<string, true> = {};

  const isExternal: IsExternal = (source: string, importer: string, isResolved: boolean) => {
    if (isResolved || source[0] === ".") {
      return;
    }
    return externalModuleCache[source] || [builtinModules, runtimeDependencies, peerDependencies].some((deps) => (
      deps.some((moduleName) => {
        if (source === moduleName) {
          return (externalModuleCache[source] = true);
        }
        const len = moduleName.length;
        if (source.substr(0, len) === moduleName && source[len].match(/^[/\\]$/)) {
          return (externalModuleCache[source] = true);
        }
        return false;
      })
    ));
  };

  if (esOutputFile) {

    configs.push(
      createModuleConfig(
        apiInput,
        "es",
        esOutputFile,
        sourcemap,
        true,
        false,
        isExternal,
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
          isExternal,
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
        isExternal,
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
          isExternal,
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
        isExternal,
        createPlugins(false, prod, binaryOutputFile),
      ),
    );

  }

  return configs;

}

export default pkgToConfigs;
