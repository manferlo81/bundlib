import pluginBabel from '@rollup/plugin-babel';
import pluginBuble from '@rollup/plugin-buble';
import pluginCommonJS from '@rollup/plugin-commonjs';
import pluginJSON from '@rollup/plugin-json';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import builtinModules from 'builtin-modules';
import { basename, dirname, join as pathJoin, resolve } from 'path';
import type { Plugin } from 'rollup';
import pluginAddShebang from 'rollup-plugin-add-shebang';
import { eslint as pluginESLint } from 'rollup-plugin-eslint';
import pluginEquals from 'rollup-plugin-export-equals';
import pluginStripShebang from 'rollup-plugin-strip-shebang';
import { terser as pluginTerser } from 'rollup-plugin-terser';
import pluginTypescript from 'rollup-plugin-typescript2';
import { MIN_PREFIX, TS_DEF_PREFIX } from './consts';
import { error, inputNotFound } from './errors';
import { JS_EXTENSIONS, TS_EXTENSIONS, TS_ONLY_EXTENSIONS } from './extensions';
import { apiPlugin as pluginAPI } from './plugins/api-plugin';
import { createConfig } from './tools/create-config';
import { createFindInput } from './tools/create-find-input';
import { createImportFromCWD } from './tools/create-import-from-cwd';
import { createIsExternal } from './tools/create-is-external';
import { createIsInstalled } from './tools/create-is-installed';
import { extensionMatch } from './tools/extension-match';
import { setProp } from './tools/helpers';
import { renamePre } from './tools/rename-pre';
import type { Nullable, TypeCheckFunction } from './types/helper-types';
import type { PkgAnalyzed } from './types/pkg-analyzed';
import type { BundlibAPIOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions, RollupSourcemap } from './types/types';

export function pkgToConfigs(
  analyzed: PkgAnalyzed,
  options: BundlibAPIOptions,
): Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>> {

  const {
    cwd,
    main: commonjsBuild,
    module: moduleBuild,
    browser: browserBuild,
    bin: binaryBuild,
    types: typesBuild,
    dependencies,
    cache,
  } = analyzed;

  const { dev, watch, onwarn } = options;

  const {
    runtime: runtimeDependencies,
    dev: devDependencies,
    peer: peerDependencies,
  } = dependencies;

  const importFromCWD = createImportFromCWD(cwd);

  const bundlibCachePath = resolve(cwd, cache || 'node_modules/.cache/bundlib');
  const typescriptCachePath = pathJoin(bundlibCachePath, 'rpt2');

  const isExternal = createIsExternal(
    runtimeDependencies,
    peerDependencies,
    builtinModules as string[],
  );

  const isProduction = !dev;

  const isInstalled = createIsInstalled(runtimeDependencies, devDependencies);

  const useESLint = isInstalled('eslint');
  const useTypescript = isInstalled('typescript');
  const useBabel = isInstalled('@babel/core');
  const useChokidar = !!isInstalled('chokidar') && !!watch;

  const extensions = useTypescript ? TS_EXTENSIONS : JS_EXTENSIONS;

  const findInput = createFindInput(cwd, extensions);

  const include = extensions.map(
    (ext) => resolve(cwd, `**/*${ext}`),
  );
  const exclude = /node_modules/;

  const configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>> = [];

  function createPlugins(
    inputFile: string,
    outputFile: string,
    rollupSourcemap: RollupSourcemap,
    mini: boolean,
    browser: boolean,
    bin: boolean,
    apiBuildFiles: Nullable<[string, string]>,
    project: Nullable<string>,
  ): Plugin[] {

    const sourcemap = !!rollupSourcemap;

    const inputIsTypescript = extensionMatch(inputFile, TS_ONLY_EXTENSIONS);
    const typesExpectedFilename = configs.length === 0 && !bin && typesBuild && resolve(
      cwd,
      extensionMatch(typesBuild.output, ['.ts']) ? typesBuild.output : pathJoin(typesBuild.output, 'index.d.ts'),
    );

    if (typesExpectedFilename && !inputIsTypescript) {
      throw error('Can\'t generate types from a non typescript file.');
    }

    const typesGeneratedFilename = renamePre(basename(inputFile), TS_DEF_PREFIX);

    if (typesExpectedFilename && typesGeneratedFilename !== basename(typesExpectedFilename)) {
      throw error('Input filename and types filename have to match.');
    }

    const declarationDir = typesExpectedFilename && dirname(typesExpectedFilename);

    let shebang: string | undefined;

    const plugins = [

      useESLint && pluginESLint({
        include,
        exclude,
        throwOnWarning: false,
        throwOnError: false,
      }),

      bin && pluginStripShebang({
        capture: (shebangFromFile: string) => shebang = shebangFromFile,
        sourcemap,
      }),

      bin && apiBuildFiles && commonjsBuild && pluginAPI(
        cwd,
        dirname(outputFile),
        extensions,
        setProp(...apiBuildFiles, {}),
      ),

      pluginNodeResolve({
        preferBuiltins: !browser,
        extensions,
        rootDir: cwd,
      }),

      browser && pluginCommonJS({
        sourceMap: sourcemap,
      }),

      useTypescript && inputIsTypescript && pluginTypescript({
        cwd,
        typescript: importFromCWD<typeof import('typescript')>('typescript'),
        cacheRoot: typescriptCachePath,
        useTsconfigDeclarationDir: true,
        tsconfigDefaults: {
          exclude: [],
        },
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: sourcemap,
            declaration: !!declarationDir,
            ...declarationDir ? { declarationDir } : { declarationMap: false },
          },
        },
        ...project && { tsconfig: resolve(cwd, project) },
      }),

      pluginJSON({ preferConst: true }),

      declarationDir && typesBuild && typesBuild.equals && pluginEquals({
        file: resolve(cwd, pathJoin(declarationDir, typesGeneratedFilename)),
      }),

      useBabel
        ? pluginBabel({
          extensions,
          exclude,
          babelHelpers: 'bundled',
        })
        : pluginBuble({
          transforms: { dangerousForOf: true },
        }),

      bin && pluginAddShebang({
        include: outputFile,
        shebang: () => shebang || '#!/usr/bin/env node',
      }),

      mini && pluginTerser({
        // sourcemap: removed on version 6
        toplevel: true,
        module: true,
        compress: {
          passes: 2,
        },
      }),

    ];

    return plugins.filter<Plugin>(Boolean as unknown as TypeCheckFunction<Plugin>);

  }

  let commonjsBuildFiles: [string, string] | null = null;

  if (commonjsBuild) {

    const { input, output, sourcemap, esModule, interop, min, project } = commonjsBuild;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('CommonJS module');
    }

    const outputFile = resolve(cwd, output);
    const outputOptions: BundlibRollupModuleOutputOptions = {
      file: outputFile,
      format: 'cjs',
      sourcemap,
      esModule,
      interop,
      exports: 'auto',
    };

    commonjsBuildFiles = [inputFile, output];

    configs.push(
      createConfig(
        inputFile,
        outputOptions,
        isExternal,
        createPlugins(
          inputFile,
          outputFile,
          sourcemap,
          isProduction && !min,
          false,
          false,
          null,
          project,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      const minOutputFile = renamePre(outputFile, MIN_PREFIX);
      const minOutputOptions = { ...outputOptions, file: minOutputFile };

      configs.push(
        createConfig(
          inputFile,
          minOutputOptions,
          isExternal,
          createPlugins(
            inputFile,
            minOutputFile,
            sourcemap,
            true,
            false,
            false,
            null,
            project,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  if (moduleBuild) {

    const { input, output, sourcemap, esModule, interop, min, project } = moduleBuild;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('ES module');
    }

    const outputFile = resolve(cwd, output);
    const outputOptions: BundlibRollupModuleOutputOptions = {
      file: outputFile,
      format: 'es',
      sourcemap,
      esModule,
      interop,
    };

    configs.push(
      createConfig(
        inputFile,
        outputOptions,
        isExternal,
        createPlugins(
          inputFile,
          outputFile,
          sourcemap,
          isProduction && !min,
          false,
          false,
          null,
          project,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      const minOutputFile = renamePre(outputFile, MIN_PREFIX);
      const minOutputOptions = { ...outputOptions, file: minOutputFile };

      configs.push(
        createConfig(
          inputFile,
          minOutputOptions,
          isExternal,
          createPlugins(
            inputFile,
            minOutputFile,
            sourcemap,
            true,
            false,
            false,
            null,
            project,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  if (browserBuild) {

    const { input, output, sourcemap, esModule, interop, format, name, extend, id, globals, min, project } = browserBuild;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('Browser build');
    }

    const outputFile = resolve(cwd, output);
    const outputOptions: BundlibRollupModuleOutputOptions = {
      file: outputFile,
      format,
      sourcemap,
      esModule,
      interop,
      extend,
      globals: globals || {},
    };

    if (format === 'iife' || format === 'umd') {
      if (!name) {
        throw error('option \'name\' is required for IIFE and UMD builds');
      }
      outputOptions.name = name;
    }

    if (id && (format === 'amd' || format === 'umd')) {
      outputOptions.amd = { id };
    }

    const isBrowserExternal = createIsExternal(globals);

    configs.push(
      createConfig(
        inputFile,
        outputOptions,
        isBrowserExternal,
        createPlugins(
          inputFile,
          outputFile,
          sourcemap,
          isProduction && !min,
          true,
          false,
          null,
          project,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      const minOutputFile = renamePre(outputFile, MIN_PREFIX);
      const minOutputOptions = { ...outputOptions, file: minOutputFile };

      configs.push(
        createConfig(
          inputFile,
          minOutputOptions,
          isBrowserExternal,
          createPlugins(
            inputFile,
            minOutputFile,
            sourcemap,
            true,
            true,
            false,
            null,
            project,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  if (binaryBuild) {

    const { input, output, sourcemap, esModule, interop, min, project } = binaryBuild;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('Binary build');
    }

    const outputFile = resolve(cwd, output);
    const outputOptions: BundlibRollupModuleOutputOptions = {
      file: outputFile,
      format: 'cjs',
      sourcemap,
      esModule,
      interop,
      exports: 'auto',
    };

    configs.push(
      createConfig(
        inputFile,
        outputOptions,
        isExternal,
        createPlugins(
          inputFile,
          outputFile,
          sourcemap,
          isProduction && !min,
          false,
          true,
          commonjsBuildFiles,
          project,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      const minOutputFile = renamePre(outputFile, MIN_PREFIX);
      const minOutputOptions = { ...outputOptions, file: minOutputFile };

      configs.push(
        createConfig(
          inputFile,
          minOutputOptions,
          isExternal,
          createPlugins(
            inputFile,
            minOutputFile,
            sourcemap,
            true,
            false,
            true,
            commonjsBuildFiles,
            project,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  return configs;

}
