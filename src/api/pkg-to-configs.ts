import builtinModules from 'builtin-modules';
import { basename, dirname, join as pathJoin, resolve } from 'path';
import { Plugin, PluginImpl } from 'rollup';
import { createBrowserConfig, createModuleConfig } from './create-config';
import { createFincInput } from './create-input-finder';
import { error, inputNotFound } from './errors';
import { JS_EXTENSIONS, TS_EXTENSIONS, TS_ONLY_EXTENSIONS } from './extensions';
import { StrictNullable } from './helper-types';
import { setProp } from './helpers';
import { createIsExternal } from './is-external';
import { createIsInstalled } from './is-installed';
import { PkgAnalized } from './pkg-analized';
import { createPluginLoader } from './plugin-loader';
import { apiPlugin as pluginAPI } from './plugins/api-plugin';
import { renameMin, renamePre } from './rename';
import { BundlibAPIOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions, RollupSourcemap } from './types';
import { extensionMatch } from './validate/ext-match';

export function pkgToConfigs(
  analized: PkgAnalized,
  options: BundlibAPIOptions,
): Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>;

export function pkgToConfigs(
  analized: PkgAnalized,
  options: BundlibAPIOptions,
): Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>> {

  const {
    cwd,
    main: commanjsOutput,
    module: moduleOutput,
    browser: browserOutput,
    bin: binaryOutput,
    types: typesOutput,
    dependencies,
    cache,
  } = analized;

  const { dev, watch, onwarn } = options;

  const {
    runtime: runtimeDependencies,
    dev: devDependencies,
    peer: peerDependencies,
  } = dependencies;

  const bundlibCache = resolve(cwd, cache || 'node_modules/.cache/bundlib');

  // throw if "name" option required and not present

  if (browserOutput) {
    const { format, name } = browserOutput;
    if ((format === 'iife' || format === 'umd') && !name) {
      throw error('option \'name\' is required for IIFE and UMD builds');
    }
  }

  const isInstalled = createIsInstalled(runtimeDependencies, devDependencies);
  const pluginLoader = createPluginLoader(cwd, isInstalled);

  // CHECK FOR INSTALLED PLUGINS

  const loadPluginTypescript2 = pluginLoader<typeof import('rollup-plugin-typescript2').default>('rollup-plugin-typescript2');
  const loadPluginTypescript = pluginLoader<PluginImpl>('@rollup/plugin-typescript');
  const loadPluginESLint = pluginLoader<typeof import('rollup-plugin-eslint').eslint>('rollup-plugin-eslint', 'eslint');
  const loadPluginNodeResolve = pluginLoader<typeof import('@rollup/plugin-node-resolve').default>('@rollup/plugin-node-resolve');
  const loadPluginCommonJS = pluginLoader<typeof import('@rollup/plugin-commonjs').default>('@rollup/plugin-commonjs');
  const loadPluginJSON = pluginLoader<typeof import('@rollup/plugin-json').default>('@rollup/plugin-json');
  const loadPluginBabel = pluginLoader<typeof import('rollup-plugin-babel').default>('rollup-plugin-babel');
  const loadPluginBuble = pluginLoader<PluginImpl>('@rollup/plugin-buble');
  const loadPluginTerser = pluginLoader<PluginImpl>('rollup-plugin-terser', 'terser');
  const loadPluginStripShebang = pluginLoader<typeof import('rollup-plugin-strip-shebang')>('rollup-plugin-strip-shebang');
  const loadPluginAddShebang = pluginLoader<typeof import('rollup-plugin-add-shebang').default>('rollup-plugin-add-shebang');
  const loadPluginExportEquals = pluginLoader<typeof import('rollup-plugin-export-equals')>('rollup-plugin-export-equals');

  // CHECK FOR INSTALLED MODULES

  const extensions = (loadPluginTypescript2 || loadPluginTypescript) ? TS_EXTENSIONS : JS_EXTENSIONS;

  const findInput = createFincInput(cwd, extensions);

  const isInstalledChokidar = isInstalled('chokidar');

  const production = !dev;

  const isExternal = createIsExternal(
    runtimeDependencies,
    peerDependencies,
    builtinModules as string[],
  );

  const useChokidar = isInstalledChokidar && !!watch;

  const exclude = /node_modules/;

  const configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>> = [];

  function createPlugins(
    inputFile: string,
    outputFile: string,
    extensions: string[],
    sourcemap: RollupSourcemap,
    mini: boolean,
    browser: boolean,
    bin: boolean,
    project: StrictNullable<string>,
    apiInput: StrictNullable<string>,
  ): Plugin[] {

    const sourcemapBool = !!sourcemap;

    const inputDirectory = dirname(inputFile);
    const inputIsTypescript = extensionMatch(inputFile, TS_ONLY_EXTENSIONS);

    let declarationDir: string | null = null;
    const typesFilename = renamePre(basename(inputFile), 'd');

    if (inputIsTypescript && configs.length === 0 && !bin) {

      let typesOutputDir = typesOutput ? resolve(cwd, typesOutput) : null;
      if (typesOutputDir && extensionMatch(typesOutputDir, ['.ts'])) {
        typesOutputDir = dirname(typesOutputDir);
      }

      declarationDir = typesOutputDir;
    }

    const include = extensions.map(
      bin
        ? (ext) => resolve(cwd, `**/*${ext}`)
        : (ext) => resolve(inputDirectory, `**/*${ext}`),
    );
    const cacheRoot = pathJoin(bundlibCache, 'rpt2');

    let shebang: string;

    const plugins = [

      loadPluginESLint && loadPluginESLint({
        include,
        exclude,
        throwOnWarning: false,
        throwOnError: false,
      }),

      bin && loadPluginStripShebang && loadPluginStripShebang({
        capture: (shebangFromFile) => shebang = shebangFromFile,
        sourcemap: sourcemapBool,
      }),

      bin && apiInput && outputFile && pluginAPI(
        cwd,
        dirname(outputFile),
        setProp(apiInput, cwd, {}),
      ),

      loadPluginNodeResolve && loadPluginNodeResolve({
        preferBuiltins: !browser,
        extensions,
        rootDir: cwd,
      }),

      browser && loadPluginCommonJS && loadPluginCommonJS({
        sourceMap: sourcemapBool,
      }),

      inputIsTypescript && loadPluginTypescript2 && loadPluginTypescript2({
        cacheRoot,
        useTsconfigDeclarationDir: true,
        tsconfigDefaults: {
          exclude: [],
        },
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: sourcemapBool,
            declaration: !!declarationDir,
            ...declarationDir && { declarationDir },
          },
        },
        ...project && { tsconfig: resolve(cwd, project) },
      }),

      inputIsTypescript && loadPluginTypescript && loadPluginTypescript(),

      loadPluginJSON && loadPluginJSON({
        preferConst: true,
      }),

      declarationDir && loadPluginExportEquals && loadPluginExportEquals({
        file: resolve(cwd, pathJoin(declarationDir, typesFilename)),
      }),

      loadPluginBabel && loadPluginBabel({
        include,
        extensions,
        exclude,
      }),

      loadPluginBuble && loadPluginBuble(),

      bin && outputFile && loadPluginAddShebang && loadPluginAddShebang({
        include: outputFile,
        shebang: () => shebang || '#!/usr/bin/env node',
      }),

      mini && loadPluginTerser && loadPluginTerser({
        sourcemap: sourcemapBool,
        toplevel: true,
        module: true,
        compress: {
          passes: 2,
        },
      }),

    ];

    return plugins.filter<Plugin>(Boolean as unknown as (val: unknown) => val is Plugin);

  }

  if (moduleOutput) {

    const { input, output, sourcemap, min } = moduleOutput;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('ES module');
    }

    const outputFile = resolve(cwd, output);

    configs.push(
      createModuleConfig(
        inputFile,
        'es',
        outputFile,
        sourcemap,
        true,
        false,
        isExternal,
        createPlugins(
          inputFile,
          outputFile,
          extensions,
          sourcemap,
          production && !min,
          false,
          false,
          moduleOutput.project,
          null,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      configs.push(
        createModuleConfig(
          inputFile,
          'es',
          renameMin(outputFile),
          sourcemap,
          true,
          false,
          isExternal,
          createPlugins(
            inputFile,
            outputFile,
            extensions,
            sourcemap,
            true,
            false,
            false,
            moduleOutput.project,
            null,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  if (commanjsOutput) {

    const { input, output, sourcemap, esModule, interop, min } = commanjsOutput;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('CommonJS module');
    }

    const resolvedPath = resolve(cwd, output);

    configs.push(
      createModuleConfig(
        inputFile,
        'cjs',
        resolvedPath,
        sourcemap,
        esModule,
        interop,
        isExternal,
        createPlugins(
          inputFile,
          resolvedPath,
          extensions,
          sourcemap,
          production && !min,
          false,
          false,
          commanjsOutput.project,
          null,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      configs.push(
        createModuleConfig(
          inputFile,
          'cjs',
          renameMin(resolvedPath),
          sourcemap,
          esModule,
          interop,
          isExternal,
          createPlugins(
            inputFile,
            resolvedPath,
            extensions,
            sourcemap,
            true,
            false,
            false,
            commanjsOutput.project,
            null,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  if (browserOutput) {

    const { input, output, sourcemap, esModule, interop, format, name, extend, id, globals, min } = browserOutput;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('Browser build');
    }

    const outputFile = resolve(cwd, output);
    const isBrowserExternal = createIsExternal(globals);

    configs.push(
      createBrowserConfig(
        inputFile,
        format,
        outputFile,
        sourcemap,
        esModule,
        interop,
        isBrowserExternal,
        createPlugins(
          inputFile,
          outputFile,
          extensions,
          sourcemap,
          production && !min,
          true,
          false,
          browserOutput.project,
          null,
        ),
        onwarn,
        useChokidar,
        name as string,
        extend,
        globals,
        id,
      ),
    );

    if (min) {

      configs.push(
        createBrowserConfig(
          inputFile,
          format,
          renameMin(outputFile),
          sourcemap,
          esModule,
          interop,
          isBrowserExternal,
          createPlugins(
            inputFile,
            outputFile,
            extensions,
            sourcemap,
            true,
            true,
            false,
            browserOutput.project,
            null,
          ),
          onwarn,
          useChokidar,
          name as string,
          extend,
          globals,
          id,
        ),
      );

    }

  }

  if (binaryOutput) {

    const { input, output, sourcemap, esModule, interop, min } = binaryOutput;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('Binary build');
    }

    const resolvedPath = resolve(cwd, output);

    configs.push(
      createModuleConfig(
        inputFile,
        'cjs',
        resolvedPath,
        sourcemap,
        esModule,
        interop,
        isExternal,
        createPlugins(
          inputFile,
          resolvedPath,
          extensions,
          sourcemap,
          production && !min,
          false,
          true,
          binaryOutput.project,
          commanjsOutput ? commanjsOutput.input : null,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      configs.push(
        createModuleConfig(
          inputFile,
          'cjs',
          renameMin(resolvedPath),
          sourcemap,
          esModule,
          interop,
          isExternal,
          createPlugins(
            inputFile,
            resolvedPath,
            extensions,
            sourcemap,
            true,
            false,
            true,
            binaryOutput.project,
            commanjsOutput ? commanjsOutput.input : null,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  return configs;

}
