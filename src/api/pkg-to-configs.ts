import pluginCommonJS from '@rollup/plugin-commonjs'
import pluginNodeResolve from '@rollup/plugin-node-resolve'
import builtinModules from 'builtin-modules'
import { basename, dirname, join as pathJoin, resolve } from 'path'
import { Plugin } from 'rollup'
import pluginAddShebang from 'rollup-plugin-add-shebang'
import pluginExportEquals from 'rollup-plugin-export-equals'
import pluginStripShebang from 'rollup-plugin-strip-shebang'
import pluginTypescript2 from 'rollup-plugin-typescript2'
import arrayToExternal from './array-to-external'
import { createBrowserConfig, createModuleConfig } from './create-config'
import { error } from './errors'
import { setProp } from './helpers'
import isDepInstalled from './is-dep-installed'
import keysOrNull from './keys-or-null'
import { PkgAnalized } from './pkg-analized'
import pluginMapIdExternal from './plugins/api-plugin'
import pluginMinify from './plugins/minify'
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
    optional: optionalDeps,
  } = dependencies

  const bundlibCache = resolve(cwd, cache || 'node_modules/.cache/bundlib')

  // throw if "name" option required and not present

  if (browserOutput) {
    const { format, name } = browserOutput
    if ((format === 'iife' || format === 'umd') && !name) {
      throw error('option \'name\' is required for IIFE and UMD builds')
    }
  }

  // CHECK FOR INSTALLED MODULES

  const typescriptIsInstalled = isDepInstalled('typescript', runtimeDeps, devDeps)
  const chokidarIsInstalled = isDepInstalled('chokidar', runtimeDeps, devDeps)

  const usePluginESLint = isDepInstalled('rollup-plugin-eslint', runtimeDeps, devDeps)
  const usePluginJSON = isDepInstalled('@rollup/plugin-json', runtimeDeps, devDeps)
  const usePluginBabel = isDepInstalled('rollup-plugin-babel', runtimeDeps, devDeps)

  const typescriptOnlyExtensions = ['.ts', '.tsx']
  const javascriptExtensions = ['.js', '.jsx', '.mjs', '.node']

  const apiInput = resolve(cwd, apiInput1 || 'src/index.ts')
  const binInput = resolve(cwd, binInput1 || 'src-bin/index.ts')

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
    keysOrNull(optionalDeps),
    builtinModules as string[],
  )

  const useUserTypescript = (
    isTypescriptAPIInput || isTypescriptBinaryInput
  ) && typescriptIsInstalled

  const useChokidar = chokidarIsInstalled && !!watch

  let typescript = useUserTypescript
    ? null
    : await import('typescript')

  const exclude = /node_modules/

  const configs: Array<BundlibRollupOptions<BundlibRollupModuleOutputOptions>> = []

  async function createPlugins(
    inputIsTypescript: boolean,
    extensions: string[],
    outputFile: string | null,
    sourcemap: RollupSourcemap,
    mini: boolean,
    browser: boolean,
    bin: boolean,
  ): Promise<Plugin[]> {

    const sourcemapBool = !!sourcemap

    const declarationDir = inputIsTypescript && !configs.length && !bin && typesOutputDir
    const tsInclude = bin ? cwdFolderContent : apiFolderContent
    const cacheRoot = pathJoin(bundlibCache, 'rpt2')

    let shebang: string

    const pluginESLint = usePluginESLint && (await import('rollup-plugin-eslint')).eslint
    const pluginJSON = usePluginJSON && (await import('@rollup/plugin-json')).default
    const pluginBabel = usePluginBabel && (await import('rollup-plugin-babel')).default

    const plugins = [

      pluginESLint && pluginESLint({
        include: tsInclude,
        exclude,
        throwOnWarning: false,
        throwOnError: false,
      }),

      bin && pluginStripShebang({
        capture: (shebangFromFile) => shebang = shebangFromFile,
        sourcemap: sourcemapBool,
      }),

      bin && cjsOutput && outputFile && pluginMapIdExternal(
        cwd,
        dirname(outputFile),
        setProp(apiInput, cwd, {}),
      ),

      pluginNodeResolve({
        preferBuiltins: !browser,
        extensions,
      }),

      browser && pluginCommonJS({
        sourceMap: sourcemapBool,
      }),

      inputIsTypescript && pluginTypescript2({
        typescript: typescript || (typescript = require(require.resolve('typescript', {
          paths: [cwd],
        }))),
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

      pluginJSON && pluginJSON(),

      declarationDir && typesOutput && typesOutput.equals && pluginExportEquals({
        file: resolve(cwd, pathJoin(declarationDir, typesFilename)),
      }),

      pluginBabel && pluginBabel({
        extensions,
        exclude,
      }),

      bin && outputFile && pluginAddShebang({
        include: outputFile,
        shebang: () => shebang || '#!/usr/bin/env node',
      }),

      mini && pluginMinify(sourcemapBool),

    ]

    return plugins.filter<Plugin>(Boolean as unknown as (val: unknown) => val is Plugin)

  }

  if (esOutput) {

    const { path, sourcemap, min } = esOutput

    configs.push(
      createModuleConfig(
        apiInput,
        'es',
        path,
        sourcemap,
        true,
        false,
        isExternal,
        await createPlugins(
          isTypescriptAPIInput,
          isTypescriptAPIInput ? typescriptExtensions : javascriptExtensions,
          path,
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
          renameMin(path),
          sourcemap,
          true,
          false,
          isExternal,
          await createPlugins(
            isTypescriptAPIInput,
            isTypescriptAPIInput ? typescriptExtensions : javascriptExtensions,
            path,
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
        await createPlugins(
          isTypescriptAPIInput,
          isTypescriptAPIInput ? typescriptExtensions : javascriptExtensions,
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
          await createPlugins(
            isTypescriptAPIInput,
            isTypescriptAPIInput ? typescriptExtensions : javascriptExtensions,
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
        await createPlugins(
          isTypescriptAPIInput,
          isTypescriptAPIInput ? typescriptExtensions : javascriptExtensions,
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
          await createPlugins(
            isTypescriptAPIInput,
            isTypescriptAPIInput ? typescriptExtensions : javascriptExtensions,
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
        await createPlugins(
          isTypescriptBinaryInput,
          isTypescriptBinaryInput ? typescriptExtensions : javascriptExtensions,
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
          await createPlugins(
            isTypescriptBinaryInput,
            isTypescriptBinaryInput ? typescriptExtensions : javascriptExtensions,
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
