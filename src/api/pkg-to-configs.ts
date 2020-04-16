import { RollupCommonJSOptions as CommonJSPluginOptions } from '@rollup/plugin-commonjs';
import { RollupJsonOptions as JsonPluginOptions } from '@rollup/plugin-json';
import { Options as NodeResolvePluginOptions } from '@rollup/plugin-node-resolve';
import builtinModules from 'builtin-modules';
import { basename, dirname, join as pathJoin, resolve } from 'path';
import { Plugin, PluginImpl } from 'rollup';
import { BabelPluginOptions } from 'rollup-plugin-babel';
import { EslintPluginOptions } from 'rollup-plugin-eslint';
import { RPT2Options as Typescript2PluginOptions } from 'rollup-plugin-typescript2';
import { error, inputNotFound } from './errors';
import { JS_EXTENSIONS, TS_EXTENSIONS, TS_ONLY_EXTENSIONS } from './extensions';
import { StrictNullable } from './helper-types';
import { PkgAnalized } from './pkg-analized';
import { apiPlugin as pluginAPI } from './plugins/api-plugin';
import { createConfig } from './tools/create-config';
import { createFincInput } from './tools/create-find-input';
import { createIsExternal } from './tools/create-is-external';
import { createIsInstalled } from './tools/create-is-installed';
import { createPluginLoader } from './tools/create-plugin-loader';
import { extensionMatch } from './tools/extension-match';
import { setProp } from './tools/helpers';
import { renameMin, renamePre } from './tools/rename';
import { BundlibAPIOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions, RollupSourcemap } from './types';

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

  const isInstalled = createIsInstalled(runtimeDependencies, devDependencies);
  const pluginLoader = createPluginLoader(cwd, isInstalled);

  interface TersePluginOptions {
    sourcemap?: boolean;
    toplevel?: boolean;
    module?: boolean;
    compress?: {
      passes: number;
    };
  }

  interface StripShebangPluginOptions {
    sourcemap?: boolean;
    capture?: (sh: string) => void;
  }

  interface AddShebangPluginOptions {
    include?: string;
    shebang?: () => string;
  }

  interface EqualsPluginOptions {
    file?: string;
  }

  const loadPluginTypescript2 = pluginLoader<PluginImpl<Typescript2PluginOptions>>('rollup-plugin-typescript2');
  const loadPluginTypescript = pluginLoader<PluginImpl>('@rollup/plugin-typescript');
  const loadPluginESLint = pluginLoader<PluginImpl<EslintPluginOptions>>('rollup-plugin-eslint', 'eslint');
  const loadPluginNodeResolve = pluginLoader<PluginImpl<NodeResolvePluginOptions>>('@rollup/plugin-node-resolve');
  const loadPluginCommonJS = pluginLoader<PluginImpl<CommonJSPluginOptions>>('@rollup/plugin-commonjs');
  const loadPluginJSON = pluginLoader<PluginImpl<JsonPluginOptions>>('@rollup/plugin-json');
  const loadPluginBabel = pluginLoader<PluginImpl<BabelPluginOptions>>('rollup-plugin-babel');
  const loadPluginBuble = pluginLoader<PluginImpl>('@rollup/plugin-buble');
  const loadPluginTerser = pluginLoader<PluginImpl<TersePluginOptions>>('rollup-plugin-terser', 'terser');
  const loadPluginStripShebang = pluginLoader<PluginImpl<StripShebangPluginOptions>>('rollup-plugin-strip-shebang');
  const loadPluginAddShebang = pluginLoader<PluginImpl<AddShebangPluginOptions>>('rollup-plugin-add-shebang');
  const loadPluginExportEquals = pluginLoader<PluginImpl<EqualsPluginOptions>>('rollup-plugin-export-equals');

  const extensions = (loadPluginTypescript2 || loadPluginTypescript) ? TS_EXTENSIONS : JS_EXTENSIONS;

  const findInput = createFincInput(cwd, extensions);

  const useChokidar = isInstalled('chokidar') && !!watch;
  const production = !dev;

  const isExternal = createIsExternal(
    runtimeDependencies,
    peerDependencies,
    builtinModules as string[],
  );

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

    const includePath = bin ? cwd : inputDirectory;
    const include = extensions.map(
      (ext) => resolve(includePath, `**/*${ext}`),
    );

    const cacheRoot = pathJoin(bundlibCache, 'rpt2');

    let shebang: string | undefined;

    const plugins = [

      loadPluginESLint && loadPluginESLint({
        include,
        exclude,
        throwOnWarning: false,
        throwOnError: false,
      }),

      bin && loadPluginStripShebang && loadPluginStripShebang({
        capture: (shebangFromFile: string) => shebang = shebangFromFile,
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

  if (commanjsOutput) {

    const { input, output, sourcemap, esModule, interop, min, project } = commanjsOutput;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('CommonJS module');
    }

    const outputFile = resolve(cwd, output);
    const outputOptions = { file: outputFile, format: 'cjs' as 'cjs', sourcemap, esModule, interop };

    configs.push(
      createConfig(
        inputFile,
        outputOptions,
        isExternal,
        createPlugins(
          inputFile,
          outputFile,
          extensions,
          sourcemap,
          production && !min,
          false,
          false,
          project,
          null,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      const minOutputFile = renameMin(outputFile);

      configs.push(
        createConfig(
          inputFile,
          { ...outputOptions, file: minOutputFile },
          isExternal,
          createPlugins(
            inputFile,
            minOutputFile,
            extensions,
            sourcemap,
            true,
            false,
            false,
            project,
            null,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  if (moduleOutput) {

    const { input, output, sourcemap, esModule, interop, min, project } = moduleOutput;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('ES module');
    }

    const outputFile = resolve(cwd, output);
    const outputOptions = { file: outputFile, format: 'es' as 'es', sourcemap, esModule, interop };

    configs.push(
      createConfig(
        inputFile,
        outputOptions,
        isExternal,
        createPlugins(
          inputFile,
          outputFile,
          extensions,
          sourcemap,
          production && !min,
          false,
          false,
          project,
          null,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      const minOutputFile = renameMin(outputFile);

      configs.push(
        createConfig(
          inputFile,
          { ...outputOptions, file: minOutputFile },
          isExternal,
          createPlugins(
            inputFile,
            minOutputFile,
            extensions,
            sourcemap,
            true,
            false,
            false,
            project,
            null,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  if (browserOutput) {

    const { input, output, sourcemap, esModule, interop, format, name, extend, id, globals, min, project } = browserOutput;
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
          extensions,
          sourcemap,
          production && !min,
          true,
          false,
          project,
          null,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      const minOutputFile = renameMin(outputFile);

      configs.push(
        createConfig(
          inputFile,
          { ...outputOptions, file: minOutputFile },
          isBrowserExternal,
          createPlugins(
            inputFile,
            minOutputFile,
            extensions,
            sourcemap,
            true,
            true,
            false,
            project,
            null,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  if (binaryOutput) {

    const { input, output, sourcemap, esModule, interop, min, project } = binaryOutput;
    const inputFile = findInput(input);

    if (!inputFile) {
      throw inputNotFound('Binary build');
    }

    const outputFile = resolve(cwd, output);
    const outputOptions = { file: outputFile, format: 'cjs' as 'cjs', sourcemap, esModule, interop };
    const apiInputFile = commanjsOutput ? commanjsOutput.input : null;

    configs.push(
      createConfig(
        inputFile,
        outputOptions,
        isExternal,
        createPlugins(
          inputFile,
          outputFile,
          extensions,
          sourcemap,
          production && !min,
          false,
          true,
          project,
          apiInputFile,
        ),
        onwarn,
        useChokidar,
      ),
    );

    if (min) {

      const minOutputFile = renameMin(outputFile);

      configs.push(
        createConfig(
          inputFile,
          { ...outputOptions, file: minOutputFile },
          isExternal,
          createPlugins(
            inputFile,
            minOutputFile,
            extensions,
            sourcemap,
            true,
            false,
            true,
            project,
            apiInputFile,
          ),
          onwarn,
          useChokidar,
        ),
      );

    }

  }

  return configs;

}
