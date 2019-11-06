import builtinModules from 'builtin-modules'
import { union } from 'lodash'
import { basename, dirname, join as pathJoin, resolve } from 'path'
import { Plugin } from 'rollup'

import addShebang from 'rollup-plugin-add-shebang'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import exportEquals from 'rollup-plugin-export-equals'
import json from 'rollup-plugin-json'
import nodeResolve from 'rollup-plugin-node-resolve'
import stripShebang from 'rollup-plugin-strip-shebang'
import { terser } from 'rollup-plugin-terser'
import typescript2 from 'rollup-plugin-typescript2'
import mapIdExternal from './api-plugin'

import arrayToExternal from './array-to-external'
import { createBrowserConfig, createModuleConfig } from './create-config'
import { error } from './errors'
import extensionMatch from './ext-match'
import { setProp } from './helpers'
import keysOrNull from './keys-or-null'
import { PkgAnalized } from './pkg-analized'
import { renameMin, renamePre } from './rename'
import {
  BundlibAPIOptions,
  BundlibRollupModuleOutputOptions,
  BundlibRollupOptions,
  RollupSourcemap,
} from './types'

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
    peer: peerDeps,
    optional: optionalDeps,
  } = dependencies

  // throw if "name" option required and not present

  if (
    browserOutput &&
    (browserOutput.format === 'iife' || browserOutput.format === 'umd') &&
    !browserOutput.name
  ) {
    throw error('option \'name\' is required for IIFE and UMD builds')
  }

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

  let typesOutputDir = typesOutput ? typesOutput.path : null
  if (typesOutputDir && extensionMatch(typesOutputDir, ['.ts'])) {
    typesOutputDir = dirname(typesOutputDir)
  }

  // set external modules

  const external = union(runtimeDeps, peerDeps, optionalDeps, builtinModules)
  const isExternal = arrayToExternal(external)

  // get installed dependencies from package.json

  const installedDeps = union(runtimeDeps, keysOrNull(pkg.devDependencies))

  // determine whetehr to use "built-in" typescript module

  const useUserTypescript = (
    isTypescriptAPIInput || isTypescriptBinaryInput
  ) && installedDeps.indexOf('typescript') >= 0

  // determine whether or not to use chokidar

  const useChokidar = !!watch && installedDeps.indexOf('chokidar') >= 0

  let typescript = useUserTypescript
    ? null
    : await import('typescript')

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
    const cacheRoot = pathJoin(cache, 'rpt2')

    let shebang: string

    const plugins = [

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

      inputIsTypescript && typescript2({
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

      json() as Plugin,

      declarationDir && typesOutput && typesOutput.equals && exportEquals({
        file: resolve(cwd, pathJoin(declarationDir, typesFilename)),
      }),

      babel({
        extensions,
        exclude,
        babelrc: true,
        presets: [
          [
            require.resolve('@babel/preset-env'),
            { loose: true },
          ],
          require.resolve('@babel/preset-react'),
        ],
        plugins: [
          require.resolve('@babel/plugin-syntax-dynamic-import'),
          [
            require.resolve('babel-plugin-transform-async-to-promises'),
            { inlineHelpers: true },
          ],
          require.resolve('@babel/plugin-transform-object-assign'),
        ],
      }),

      bin && outputFile && addShebang({
        include: outputFile,
        shebang: () => shebang || '#!/usr/bin/env node',
      }),

      mini && terser({
        sourcemap: sourcemapBool,
        toplevel: true,
        module: true,
      }),

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
        createPlugins(
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
          createPlugins(
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

    configs.push(
      createModuleConfig(
        apiInput,
        'cjs',
        path,
        sourcemap,
        esModule,
        interop,
        isExternal,
        createPlugins(
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
          'cjs',
          renameMin(path),
          sourcemap,
          esModule,
          interop,
          isExternal,
          createPlugins(
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

  if (browserOutput) {

    const { path, sourcemap, esModule, interop, format, name, extend, id, globals, min } = browserOutput
    const isBrowserExternal = arrayToExternal(keysOrNull(globals))

    configs.push(
      createBrowserConfig(
        apiInput,
        format,
        path,
        sourcemap,
        esModule,
        interop,
        isBrowserExternal,
        createPlugins(
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
          renameMin(path),
          sourcemap,
          esModule,
          interop,
          isBrowserExternal,
          createPlugins(
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

    configs.push(
      createModuleConfig(
        binInput,
        'cjs',
        path,
        sourcemap,
        esModule,
        interop,
        isExternal,
        createPlugins(
          isTypescriptBinaryInput,
          isTypescriptBinaryInput ? typescriptExtensions : javascriptExtensions,
          path,
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
          renameMin(path),
          sourcemap,
          esModule,
          interop,
          isExternal,
          createPlugins(
            isTypescriptBinaryInput,
            isTypescriptBinaryInput ? typescriptExtensions : javascriptExtensions,
            path,
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
