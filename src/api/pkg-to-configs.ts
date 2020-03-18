import builtinModules from 'builtin-modules'
import { basename, dirname, join as pathJoin, resolve } from 'path'
import { Plugin } from 'rollup'
import arrayToExternal from './array-to-external'
import { createBrowserConfig, createModuleConfig } from './create-config'
import { error } from './errors'
import findFirst from './find-first'
import { setProp } from './helpers'
import isDepInstalled from './is-dep-installed'
import keysOrNull from './keys-or-null'
import { PkgAnalized } from './pkg-analized'
import pluginLoader from './plugin-loader'
import pluginMapIdExternal from './plugins/api-plugin'
import { renameMin, renamePre } from './rename'
import { BundlibAPIOptions, BundlibRollupModuleOutputOptions, BundlibRollupOptions, RollupSourcemap } from './types'
import extensionMatch from './validate/ext-match'

async function pkgToConfigs(
  pkg: PkgAnalized,
  options: BundlibAPIOptions,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>>;

async function pkgToConfigs(
  { cwd, input, dependencies, cache, output }: PkgAnalized,
  { dev, watch }: BundlibAPIOptions,
): Promise<Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>>> {

  const {
    api: apiInput1,
    bin: binInput1,
  } = input

  const {
    main: cjsOutput,
    module: esOutput,
    browser: browserOutput,
    bin: binaryOutput,
    types: typesOutput,
  } = output

  const {
    runtime: runtimeDeps,
    dev: devDeps,
    peer: peerDeps,
  } = dependencies

  const bundlibCache = resolve(cwd, cache || 'node_modules/.cache/bundlib')

  // throw if "name" option required and not present

  if (browserOutput) {
    const { format, name } = browserOutput
    if ((format === 'iife' || format === 'umd') && !name) {
      throw error('option \'name\' is required for IIFE and UMD builds')
    }
  }

  // CHECK FOR INSTALLED PLUGINS

  const loadPluginTypescript2 = await pluginLoader<typeof import('rollup-plugin-typescript2').default>('rollup-plugin-typescript2', ['typescript'], 'default', runtimeDeps, devDeps)
  const loadPluginESLint = await pluginLoader<typeof import('rollup-plugin-eslint').eslint>('rollup-plugin-eslint', null, 'eslint', runtimeDeps, devDeps)
  const loadPluginNodeResolve = await pluginLoader<typeof import('@rollup/plugin-node-resolve').default>('@rollup/plugin-node-resolve', null, 'default', runtimeDeps, devDeps)
  const loadPluginCommonJS = await pluginLoader<typeof import('@rollup/plugin-commonjs').default>('@rollup/plugin-commonjs', null, 'default', runtimeDeps, devDeps)
  const loadPluginJSON = await pluginLoader<typeof import('@rollup/plugin-json').default>('@rollup/plugin-json', null, 'default', runtimeDeps, devDeps)
  const loadPluginBabel = await pluginLoader<typeof import('rollup-plugin-babel').default>('rollup-plugin-babel', null, 'default', runtimeDeps, devDeps)
  const loadPluginTerser = await pluginLoader<typeof import('rollup-plugin-terser').terser>('rollup-plugin-terser', null, 'terser', runtimeDeps, devDeps)
  const loadPluginStripShebang = await pluginLoader<typeof import('rollup-plugin-strip-shebang')>('rollup-plugin-strip-shebang', null, 'default', runtimeDeps, devDeps)
  const loadPluginAddShebang = await pluginLoader<typeof import('rollup-plugin-add-shebang').default>('rollup-plugin-add-shebang', null, 'default', runtimeDeps, devDeps)
  const loadPluginExportEquals = await pluginLoader<typeof import('rollup-plugin-export-equals')>('rollup-plugin-export-equals', null, 'default', runtimeDeps, devDeps)

  // CHECK FOR INSTALLED MODULES

  const isInstalledChokidar = isDepInstalled('chokidar', runtimeDeps, devDeps)

  const apiInput = apiInput1 ? resolve(cwd, apiInput1) : (
    (
      loadPluginTypescript2 ? findFirst(
        ...['index.ts', 'index.tsx'].map((filename) => resolve(cwd, 'src', filename)),
      ) : null
    ) ||
    resolve(cwd, 'src', 'index.js')
  )

  const binInput = binInput1 ? resolve(cwd, binInput1) : (
    (
      loadPluginTypescript2 ? findFirst(
        ...['index.ts'].map((filename) => resolve(cwd, 'src-bin', filename)),
      ) : null
    ) ||
    resolve(cwd, 'src-bin', 'index.js')
  )

  const typescriptOnlyExtensions = ['.ts', '.tsx']
  const javascriptExtensions = ['.js', '.jsx', '.mjs', '.node']

  const isTypescriptAPIInput = extensionMatch(apiInput, typescriptOnlyExtensions)
  const isTypescriptBinaryInput = extensionMatch(binInput, typescriptOnlyExtensions)

  // throw if trying to generate type definitions from javascript input
  // TODO: show warning intead of throwing

  if (
    typesOutput &&
    !isTypescriptAPIInput
  ) {
    throw error('can\'t generate types from javascript source')
  }

  const typescriptExtensions = [...typescriptOnlyExtensions, ...javascriptExtensions]

  const apiExtensions = isTypescriptAPIInput ? typescriptExtensions : javascriptExtensions
  const binaryExtensions = isTypescriptBinaryInput ? typescriptExtensions : javascriptExtensions

  const production = !dev

  const apiFolder = dirname(apiInput)

  const apiFolderContent = apiExtensions.map((ext) => (
    resolve(apiFolder, `**/*${ext}`)
  ))
  const cwdFolderContent = binaryExtensions.map((ext) => (
    resolve(cwd, `**/*${ext}`)
  ))

  const typesFilename = renamePre(basename(apiInput), 'd')

  let typesOutputDir = typesOutput ? resolve(cwd, typesOutput.path) : null
  if (typesOutputDir && extensionMatch(typesOutputDir, ['.ts'])) {
    typesOutputDir = dirname(typesOutputDir)
  }

  const isExternal = arrayToExternal(
    keysOrNull(runtimeDeps),
    keysOrNull(peerDeps),
    builtinModules as string[],
  )

  const useChokidar = isInstalledChokidar && !!watch

  const exclude = /node_modules/

  const configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>> = []

  function createPlugins(
    inputIsTypescript: boolean,
    extensions: string[],
    outputFile: string | null,
    sourcemap: RollupSourcemap,
    mini: boolean,
    browser: boolean,
    bin: boolean,
  ): Plugin[] {

    const sourcemapBool = !!sourcemap

    const declarationDir = inputIsTypescript && !configs.length && !bin && typesOutputDir
    const tsInclude = bin ? cwdFolderContent : apiFolderContent
    const cacheRoot = pathJoin(bundlibCache, 'rpt2')

    let shebang: string

    const plugins = [

      loadPluginESLint && loadPluginESLint({
        include: tsInclude,
        exclude,
        throwOnWarning: false,
        throwOnError: false,
      }),

      bin && loadPluginStripShebang && loadPluginStripShebang({
        capture: (shebangFromFile) => shebang = shebangFromFile,
        sourcemap: sourcemapBool,
      }),

      bin && cjsOutput && outputFile && pluginMapIdExternal(
        cwd,
        dirname(outputFile),
        setProp(apiInput, cwd, {}),
      ),

      loadPluginNodeResolve && loadPluginNodeResolve({
        preferBuiltins: !browser,
        extensions,
      }),

      browser && loadPluginCommonJS && loadPluginCommonJS({
        sourceMap: sourcemapBool,
      }),

      inputIsTypescript && loadPluginTypescript2 && loadPluginTypescript2({
        include: tsInclude,
        cacheRoot,
        useTsconfigDeclarationDir: true,
        tsconfigDefaults: {
          include: tsInclude,
          exclude: [],
          compilerOptions: {
            esModuleInterop: true,
            resolveJsonModule: true,
            allowSyntheticDefaultImports: true,
          },
        },
        tsconfigOverride: {
          compilerOptions: {
            target: 'esnext',
            module: 'esnext',
            moduleResolution: 'node',
            sourceMap: sourcemapBool,
            declaration: !!declarationDir,
            declarationDir: declarationDir || '',
            allowJs: !typesOutputDir,
            emitDeclarationOnly: false,
          },
        },
      }),

      loadPluginJSON && loadPluginJSON(),

      declarationDir && typesOutput && typesOutput.equals && loadPluginExportEquals && loadPluginExportEquals({
        file: resolve(cwd, pathJoin(declarationDir, typesFilename)),
      }),

      loadPluginBabel && loadPluginBabel({
        extensions,
        exclude,
      }),

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

    ]

    return plugins.filter<Plugin>(Boolean as unknown as (val: unknown) => val is Plugin)

  }

  if (esOutput) {

    const { path, sourcemap, min } = esOutput
    const resolvedPath = resolve(cwd, path)

    configs.push(
      createModuleConfig(
        apiInput,
        'es',
        resolvedPath,
        sourcemap,
        true,
        false,
        isExternal,
        createPlugins(
          isTypescriptAPIInput,
          apiExtensions,
          resolvedPath,
          sourcemap,
          production && !min,
          false,
          false,
        ),
        useChokidar,
      ),
    )

    if (min) {

      configs.push(
        createModuleConfig(
          apiInput,
          'es',
          renameMin(resolvedPath),
          sourcemap,
          true,
          false,
          isExternal,
          createPlugins(
            isTypescriptAPIInput,
            apiExtensions,
            resolvedPath,
            sourcemap,
            true,
            false,
            false,
          ),
          useChokidar,
        ),
      )

    }

  }

  if (cjsOutput) {

    const { path, sourcemap, esModule, interop, min } = cjsOutput
    const resolvedPath = resolve(cwd, path)

    configs.push(
      createModuleConfig(
        apiInput,
        'cjs',
        resolvedPath,
        sourcemap,
        esModule,
        interop,
        isExternal,
        createPlugins(
          isTypescriptAPIInput,
          apiExtensions,
          resolvedPath,
          sourcemap,
          production && !min,
          false,
          false,
        ),
        useChokidar,
      ),
    )

    if (min) {

      configs.push(
        createModuleConfig(
          apiInput,
          'cjs',
          renameMin(resolvedPath),
          sourcemap,
          esModule,
          interop,
          isExternal,
          createPlugins(
            isTypescriptAPIInput,
            apiExtensions,
            resolvedPath,
            sourcemap,
            true,
            false,
            false,
          ),
          useChokidar,
        ),
      )

    }

  }

  if (browserOutput) {

    const { path, sourcemap, esModule, interop, format, name, extend, id, globals, min } = browserOutput
    const resolvedPath = resolve(cwd, path)
    const isBrowserExternal = arrayToExternal(keysOrNull(globals))

    configs.push(
      createBrowserConfig(
        apiInput,
        format,
        resolvedPath,
        sourcemap,
        esModule,
        interop,
        isBrowserExternal,
        createPlugins(
          isTypescriptAPIInput,
          apiExtensions,
          null,
          sourcemap,
          production && !min,
          true,
          false,
        ),
        useChokidar,
        name as string,
        extend,
        globals,
        id,
      ),
    )

    if (min) {

      configs.push(
        createBrowserConfig(
          apiInput,
          format,
          renameMin(resolvedPath),
          sourcemap,
          esModule,
          interop,
          isBrowserExternal,
          createPlugins(
            isTypescriptAPIInput,
            apiExtensions,
            null,
            sourcemap,
            true,
            true,
            false,
          ),
          useChokidar,
          name as string,
          extend,
          globals,
          id,
        ),
      )

    }

  }

  if (binaryOutput) {

    const { path, sourcemap, esModule, interop, min } = binaryOutput
    const resolvedPath = resolve(cwd, path)

    configs.push(
      createModuleConfig(
        binInput,
        'cjs',
        resolvedPath,
        sourcemap,
        esModule,
        interop,
        isExternal,
        createPlugins(
          isTypescriptBinaryInput,
          binaryExtensions,
          resolvedPath,
          sourcemap,
          production && !min,
          false,
          true,
        ),
        useChokidar,
      ),
    )

    if (min) {

      configs.push(
        createModuleConfig(
          binInput,
          'cjs',
          renameMin(resolvedPath),
          sourcemap,
          esModule,
          interop,
          isExternal,
          createPlugins(
            isTypescriptBinaryInput,
            binaryExtensions,
            resolvedPath,
            sourcemap,
            true,
            false,
            true,
          ),
          useChokidar,
        ),
      )

    }

  }

  return configs

}

export default pkgToConfigs
