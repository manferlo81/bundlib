import pluginBabel from '@rollup/plugin-babel';
import pluginBuble from '@rollup/plugin-buble';
import pluginCommonJS from '@rollup/plugin-commonjs';
import pluginESLint from '@rollup/plugin-eslint';
import pluginJSON from '@rollup/plugin-json';
import pluginNodeResolve from '@rollup/plugin-node-resolve';
import pluginTerser from '@rollup/plugin-terser';
import builtinModules from 'builtin-modules';
import { basename, dirname, join as pathJoin, resolve } from 'path';
import type { Plugin } from 'rollup';
import pluginAddShebang from 'rollup-plugin-add-shebang';
import pluginEquals from 'rollup-plugin-export-equals';
import pluginStripShebang from 'rollup-plugin-strip-shebang';
import pluginTypescript from 'rollup-plugin-typescript2';
import { MIN_PREFIX, TS_DEF_PREFIX } from './consts/consts';
import { JS_EXTENSIONS, TS_EXTENSIONS, TS_ONLY_EXTENSIONS } from './consts/extensions';
import { error } from './errors/error';
import { inputNotFoundMessage } from './errors/error-messages';
import { pluginChunks } from './plugins/chunks';
import { createConfig } from './tools/create-config';
import { createIsExternal } from './tools/create-is-external';
import { createResolveInput } from './tools/create-resolve-input';
import { extensionMatch } from './tools/extension-match';
import { keys } from './tools/helpers';
import { renamePre } from './tools/rename-pre';
import type { AllowNull, AllowNullish, Dictionary, TypeCheckFunction } from './types/helper-types';
import type { PkgAnalyzed } from './types/pkg-analyzed';
import type { BundlibRollupBrowseOutputOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions, RollupBundlibInterop, RollupInterop, RollupSourcemap } from './types/rollup';
import type { BundlibAPIOptions } from './types/types';

function convertInterop(interopBool: RollupBundlibInterop): RollupInterop {
  if (interopBool === true) return 'compat';
  if (interopBool === false) return 'default';
  return interopBool;
}

export function pkgToConfigs(
  analyzed: PkgAnalyzed,
  options?: AllowNullish<BundlibAPIOptions>,
): Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>> {

  const {
    cwd,
    main: commonjsBuild,
    module: moduleBuild,
    browser: browserBuild,
    bin: binaryBuild,
    types: typesBuild,
    chunks,
    dependencies,
    cache,
    installed,
  } = analyzed;

  const { dev, watch, onwarn } = options ?? {} as BundlibAPIOptions;

  const { runtime: runtimeDependencies, peer: peerDependencies } = dependencies;

  const bundlibCachePath = resolve(cwd, cache ?? 'node_modules/.cache/bundlib');
  const typescriptCachePath = pathJoin(bundlibCachePath, 'rpt2');

  const isNodeJSExternal = createIsExternal(
    runtimeDependencies ? keys(runtimeDependencies) : null,
    peerDependencies ? keys(peerDependencies) : null,
    builtinModules,
  );

  const isProduction = !dev;

  const { eslint: useESLint, babel: useBabel, chokidar: useChokidar, typescript: useTypescript } = installed;

  const shouldUseChokidar = !!useChokidar && !!watch;

  const extensions = useTypescript ? TS_EXTENSIONS : JS_EXTENSIONS;

  const resolveInput = createResolveInput(cwd, extensions);

  const include = extensions.map(
    (ext) => resolve(cwd, `**/*${ext}`),
  );
  const exclude = 'node_modules/**';

  const configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>> = [];

  function createPlugins(
    inputFile: string,
    outputFile: string,
    rollupSourcemap: RollupSourcemap,
    minifyOutput: boolean,
    isBrowserBuild: boolean,
    isBinaryBuild: boolean,
    chunks: AllowNullish<Dictionary<string>>,
    project: AllowNullish<string>,
  ): Plugin[] {

    const sourcemap = rollupSourcemap !== false;

    const inputIsTypescript = extensionMatch(inputFile, TS_ONLY_EXTENSIONS);

    if (inputIsTypescript && !useTypescript) {
      throw error('Can\'t use typescript input file if typescript is not installed');
    }

    const generateTypes = configs.length === 0 && !isBinaryBuild && typesBuild;

    if (generateTypes && !inputIsTypescript) {
      throw error('Can\'t generate types from a non typescript file.');
    }

    const typesExpectedFilename = generateTypes && resolve(
      cwd,
      extensionMatch(typesBuild.output, ['.ts']) ? typesBuild.output : pathJoin(typesBuild.output, 'index.d.ts'),
    );

    const typesGeneratedFilename = renamePre(basename(inputFile), TS_DEF_PREFIX);

    if (typesExpectedFilename && basename(typesExpectedFilename) !== typesGeneratedFilename) {
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

      isBinaryBuild && pluginStripShebang({
        capture: (capturedShebang: string) => shebang = capturedShebang,
        sourcemap,
      }),

      chunks && pluginChunks(
        cwd,
        dirname(outputFile),
        extensions,
        chunks,
      ),

      pluginNodeResolve({
        preferBuiltins: !isBrowserBuild,
        extensions,
        rootDir: cwd,
      }),

      isBrowserBuild && pluginCommonJS({
        sourceMap: sourcemap,
        defaultIsModuleExports: true,
        requireReturnsDefault: true,
      }),

      useTypescript && inputIsTypescript && pluginTypescript({
        cwd,
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

      declarationDir && typesBuild.equals && pluginEquals({
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

      isBinaryBuild && pluginAddShebang({
        include: outputFile,
        shebang: () => shebang ?? '#!/usr/bin/env node',
      }),

      minifyOutput && pluginTerser({
        toplevel: true,
        module: true,
        compress: { passes: 2 },
      }),

    ];

    return plugins.filter<Plugin>(Boolean as unknown as TypeCheckFunction<Plugin>);

  }

  let commonjsChunks: AllowNull<Dictionary<string>> = null;

  if (commonjsBuild) {

    const { input, output, sourcemap, esModule, interop: interopBool, min, project } = commonjsBuild;
    const inputFile = resolveInput(input);

    if (!inputFile) {
      throw error(inputNotFoundMessage('CommonJS module'));
    }

    const outputFile = resolve(cwd, output);
    const interop = convertInterop(interopBool);

    const outputOptions: BundlibRollupModuleOutputOptions = {
      file: outputFile,
      format: 'cjs',
      sourcemap,
      esModule,
      interop,
      exports: 'auto',
    };

    commonjsChunks = { ...chunks, [inputFile]: cwd };

    configs.push(
      createConfig({
        input: inputFile,
        output: outputOptions,
        isExternal: isNodeJSExternal,
        plugins: createPlugins(
          inputFile,
          outputFile,
          sourcemap,
          isProduction && !min,
          false,
          false,
          commonjsChunks,
          project,
        ),
        onwarn,
        useChokidar: shouldUseChokidar,
      }),
    );

    if (min) {

      const minOutputFile = renamePre(outputFile, MIN_PREFIX);
      const minOutputOptions = { ...outputOptions, file: minOutputFile };

      configs.push(
        createConfig({
          input: inputFile,
          output: minOutputOptions,
          isExternal: isNodeJSExternal,
          plugins: createPlugins(
            inputFile,
            minOutputFile,
            sourcemap,
            true,
            false,
            false,
            commonjsChunks,
            project,
          ),
          onwarn,
          useChokidar: shouldUseChokidar,
        }),
      );

    }

    if (chunks) {
      for (const input of keys(chunks)) {

        const inputFile = resolve(cwd, input);
        const outputFile = resolve(cwd, chunks[input]);

        const chunkOutputOptions = { ...outputOptions, file: outputFile };

        configs.push(
          createConfig({
            input: inputFile,
            output: chunkOutputOptions,
            isExternal: isNodeJSExternal,
            plugins: createPlugins(
              inputFile,
              outputFile,
              sourcemap,
              isProduction && !min,
              false,
              false,
              commonjsChunks,
              project,
            ),
            onwarn,
            useChokidar: shouldUseChokidar,
          }),
        );

      }
    }

  }

  if (moduleBuild) {

    const { input, output, sourcemap, esModule, interop: interopBool, min, project } = moduleBuild;
    const inputFile = resolveInput(input);

    if (!inputFile) {
      throw error(inputNotFoundMessage('ES module'));
    }

    const outputFile = resolve(cwd, output);
    const interop = convertInterop(interopBool);

    const outputOptions: BundlibRollupModuleOutputOptions = {
      file: outputFile,
      format: 'es',
      sourcemap,
      esModule,
      interop,
    };

    configs.push(
      createConfig({
        input: inputFile,
        output: outputOptions,
        isExternal: isNodeJSExternal,
        plugins: createPlugins(
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
        useChokidar: shouldUseChokidar,
      }),
    );

    if (min) {

      const minOutputFile = renamePre(outputFile, MIN_PREFIX);
      const minOutputOptions = { ...outputOptions, file: minOutputFile };

      configs.push(
        createConfig({
          input: inputFile,
          output: minOutputOptions,
          isExternal: isNodeJSExternal,
          plugins: createPlugins(
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
          useChokidar: shouldUseChokidar,
        }),
      );

    }

  }

  if (browserBuild) {

    const { input, output, sourcemap, esModule, interop: interopBool, format, name, extend, id, globals: inputGlobals, min, project } = browserBuild;
    const browserInputFile = resolveInput(input);

    if (!browserInputFile) {
      throw error(inputNotFoundMessage('Browser build'));
    }

    const browserOutputFile = resolve(cwd, output);
    const interop = convertInterop(interopBool);
    const globals = inputGlobals ?? {};

    let outputOptions: BundlibRollupBrowseOutputOptions = {
      file: browserOutputFile,
      format,
      sourcemap,
      esModule,
      interop,
      extend,
      globals,
    };

    if (format === 'iife' || format === 'umd') {
      if (!name) {
        throw error('option "name" is required for IIFE and UMD builds');
      }
      outputOptions = { ...outputOptions, name };
    }

    if (id && (format === 'amd' || format === 'umd')) {
      outputOptions = { ...outputOptions, amd: { id } };
    }

    const isBrowserExternal = createIsExternal(inputGlobals ? keys(inputGlobals) : null);

    configs.push(
      createConfig({
        input: browserInputFile,
        output: outputOptions,
        isExternal: isBrowserExternal,
        plugins: createPlugins(
          browserInputFile,
          browserOutputFile,
          sourcemap,
          isProduction && !min,
          true,
          false,
          null,
          project,
        ),
        onwarn,
        useChokidar: shouldUseChokidar,
      }),
    );

    if (min) {

      const minOutputFile = renamePre(browserOutputFile, MIN_PREFIX);
      const minOutputOptions = { ...outputOptions, file: minOutputFile };

      configs.push(
        createConfig({
          input: browserInputFile,
          output: minOutputOptions,
          isExternal: isBrowserExternal,
          plugins: createPlugins(
            browserInputFile,
            minOutputFile,
            sourcemap,
            true,
            true,
            false,
            null,
            project,
          ),
          onwarn,
          useChokidar: shouldUseChokidar,
        }),
      );

    }

  }

  if (binaryBuild) {

    const { input, output, sourcemap, esModule, interop: interopBool, min, project } = binaryBuild;
    const inputFile = resolveInput(input);

    if (!inputFile) {
      throw error(inputNotFoundMessage('Binary build'));
    }

    const outputFile = resolve(cwd, output);
    const interop = convertInterop(interopBool);

    const outputOptions: BundlibRollupModuleOutputOptions = {
      file: outputFile,
      format: 'cjs',
      sourcemap,
      esModule,
      interop,
      exports: 'auto',
    };

    configs.push(
      createConfig({
        input: inputFile,
        output: outputOptions,
        isExternal: isNodeJSExternal,
        plugins: createPlugins(
          inputFile,
          outputFile,
          sourcemap,
          isProduction && !min,
          false,
          true,
          commonjsChunks,
          project,
        ),
        onwarn,
        useChokidar: shouldUseChokidar,
      }),
    );

    if (min) {

      const minOutputFile = renamePre(outputFile, MIN_PREFIX);
      const minOutputOptions = { ...outputOptions, file: minOutputFile };

      configs.push(
        createConfig({
          input: inputFile,
          output: minOutputOptions,
          isExternal: isNodeJSExternal,
          plugins: createPlugins(
            inputFile,
            minOutputFile,
            sourcemap,
            true,
            false,
            true,
            commonjsChunks,
            project,
          ),
          onwarn,
          useChokidar: shouldUseChokidar,
        }),
      );

    }

  }

  return configs;

}
