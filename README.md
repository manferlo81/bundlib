# Bundlib

[![CircleCI](https://circleci.com/gh/manferlo81/bundlib.svg?style=svg)](https://circleci.com/gh/manferlo81/bundlib)
[![npm](https://badgen.net/npm/v/bundlib)](https://www.npmjs.com/package/bundlib)
[![codecov](https://codecov.io/gh/manferlo81/bundlib/branch/main/graph/badge.svg?token=PrVW2D6bfl)](https://codecov.io/gh/manferlo81/bundlib)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/bundlib)](https://libraries.io/npm/bundlib)
[![install size](https://packagephobia.com/badge?p=bundlib)](https://packagephobia.com/result?p=bundlib)
[![types](https://img.shields.io/npm/types/bundlib.svg)](https://github.com/microsoft/typescript)
[![Known Vulnerabilities](https://snyk.io/test/github/manferlo81/bundlib/main/badge.svg)](https://snyk.io/test/github/manferlo81/bundlib)
[![license](https://badgen.net/github/license/manferlo81/bundlib)](LICENSE)

An automatic library bundler powered by [Rollup.js](https://github.com/rollup/rollup).

> :warning: **Bundlib** is under development, please [file a new issue](https://github.com/manferlo81/bundlib/issues) if you find any issue or bug, suggestions are welcome as well.

## In this guide

* [Install](#install)
* [Build](#build)
* [Configuration](#configuration)
  * [Automatic Configuration](#automatic-configuration)
  * [Advanced Configuration](#advanced-configuration)
* [Options](#options)
  * [input](#option-input)
  * [sourcemap](#option-sourcemap)
  * [esModule](#option-esmodule)
  * [interop](#option-interop)
  * [chunks](#option-chunks)
  * [format](#option-format)
  * [name](#option-name)
  * [id](#option-id)
  * [extend](#option-extend)
  * [globals](#option-globals)
  * [min](#option-min)
  * [equals](#option-equals)
  * [cache](#option-cache)
  * [project](#option-project)
  * [skip](#option-skip)
* [Selective Options](#selective-options)
  * [Value based selective format](#value-based-selective-format)
    * [As value](#as-value)
    * [As nullish](#as-nullish)
    * [As object](#as-object)
      * [The special `default` property](#the-special-default-property)
      * [The special `api` property](#the-special-api-property)
  * [Boolean based selective format](#boolean-based-selective-format)
    * [As boolean](#as-boolean)
    * [As key](#as-key)
    * [As array of keys](#as-array-of-keys)
    * [The special `api` key](#the-special-api-key)
    * [As value based](#as-value-based)
* [Using the CLI tool](#using-the-cli-tool)
* [Using **Bundlib** programmatically](#using-bundlib-programmatically)
  * [Functions](#functions)
    * [function `bundlib`](#function-bundlib)
    * [function `readPkg`](#function-readpkg)
    * [function `analyzePkg`](#function-analyzepkg)
    * [function `pkgToConfigs`](#function-pkgtoconfigs)
    * [function `configsFromPkg`](#function-configsfrompkg)
  * [Types](#types)
    * [type `BundlibConfig`](#type-bundlibconfig)
    * [type `PkgAnalyzed`](#type-pkganalyzed)
    * [type `ModuleBuildOptions`](#type-modulebuildoptions)
    * [type `BrowserBuildOptions`](#type-browserbuildoptions)
    * [type `TypesBuildOptions`](#type-typesbuildoptions)
    * [type `BundlibAPIOptions`](#type-bundlibapioptions)
  * [Selective Types](#selective-types)
    * [type `SelectiveValueBasedOption`](#type-selectivevaluebasedoption)
    * [type `SelectiveBoolBasedOption`](#type-selectiveboolbasedoption)
    * [type `BuildType`](#type-buildtype)
    * [type `SelectiveStringOption`](#type-selectivestringoption)
    * [type `SelectiveSourcemapOption`](#type-selectivesourcemapoption)
    * [type `SelectiveEsModuleOption`](#type-selectiveesmoduleoption)
    * [type `SelectiveInteropOption`](#type-selectiveinteropoption)
    * [type `SelectiveMinOption`](#type-selectiveminoption)
    * [type `SelectiveSkipOption`](#type-selectiveskipoption)
* [Plugin Notes](#plugin-notes)
  * [`@rollup/plugin-eslint`](#plugin-rollupplugin-eslint)
  * [`rollup-plugin-typescript2`](#plugin-rollup-plugin-typescript2)
* [Features](#features)

## Install

```bash
npm install bundlib --save-dev # or for short: npm i bundlib -D
```

## Build

**Bundlib** will try to find your entry point file in the **`src`** folder. You can manually set your entry points using the [`input`](#option-input) option.

### CommonJS module

To build a `CommonJS Module` simply add a `"main"` field to your `package.json` pointing to the output file, [see the configuration section](#configuration) for extra options.

### ES module

To build a `ES Module` add a `"module"` field to your `package.json` pointing to the output file, [see the configuration section](#configuration) for extra options.

### IIFE, AMD and UMD build

For `IIFE`, `AMD` or `UMD` builds, add a `"browser"` field to your `package.json`. The default format is `"umd"` but it can be changed to `"iife"` or `"amd"` using the [`format`](#option-format) option, see the [configuration section](#configuration) for more info and extra options.

## Configuration

### Automatic Configuration

**Bundlib** will configure [**Rollup**](https://github.com/rollup/rollup) according to you `package.json` data, see [Advanced Configuration](#advanced-configuration) for more information.

#### "main"

The `"main"` field will be used as your **CommonJS module** output, if not present, **CommonJS Module** build will be skipped. You can skip the build manually using the [`skip`](#option-skip) option.

#### "module" or "jsnext:main"

The `"module"` field will be used as your **ES Module** output, if not present, **ES Module** build will be skipped. You can skip the build manually using the [`skip`](#option-skip) option. `"jsnext:main"` field will also be honored if `"module"` field is not present, but it is recommended to use the `"module"` field.

#### "browser"

The `"browser"` field will be used as your **Browser** build output, if not present, **Browser** build will be skipped. You can skip the build manually using the [`skip`](#option-skip) option. **Bundlib** only supports `string` type `"browser"` field, it will **throw** otherwise.

#### "bin"

The `"bin"` field will be used as your **Binary** build output, if not present, **Binary** build will be skipped. You can skip the build manually using the [`skip`](#option-skip) option. **Bundlib** only supports `string` type `"bin"` field, it will **throw** otherwise.

#### "types" or "typings"

The `"types"` field will be used as your **Types** output if you are using `typescript`. You can skip types generation using the [`skip`](#option-skip) option. `"typings"` field will also be honored if `"types"` field is not present.

#### "dependencies"

The `"dependencies"` field will be used to detect installed packages, it will also be used to set external dependencies for your **CommonJS module**, **ES module**, and **Binary** builds, for **Browser** build dependencies will be bundled into the output file unless otherwise specified using the [`globals`](#option-globals) option.

#### "devDependencies"

The `"devDependencies"` field will be used to detect installed packages.

#### "peerDependencies"

The `"peerDependencies"` field will be used as external dependencies for your **CommonJS module,**, **ES module**, and **Binary** builds.

#### "bundlib"

The `"bundlib"` field can be used for advanced configuration, see [Advanced Configuration](#advanced-configuration) for more information.

### Advanced Configuration

Advanced configuration can be done using the `"bundlib"` field in your `package.json` or by using one of the supported [configuration files](#configuration-files).

#### Configuration in `package.json`

Set `"bundlib"` field in your `package.json` to an `object` with your configuration. See [options](#options) for more information.

***example***

```json
// package.json
{
  "name": "my-lib",
  "version": "1.0.0",
  "browser" : "dist/my-lib.amd.js",
  "bundlib": {
    "format": "amd"
  }
  ...
}
```

You can also set `"bundlib"` field in `package.json` to a `string` as a path, relative to the project root, pointing to a `.json`, `.yaml`, `.yml`, `.js`, `.cjs`, `.mjs` or `.ts`, or `json` or `yaml` format file without extension containing the configuration.

***example***

```json
// package.json
{
  "name": "my-lib",
  "version": "1.0.0",
  "browser" : "dist/my-lib.amd.js",
  "bundlib": "options.yml"
  // ...
}
```

then...

```yaml
# options.yaml
format: amd
```

#### Configuration files

If `"bundlib"` field not present in your `package.json`, **Bundlib** will try to find your configuration file using the following order...

* .bundlibrc (json or yaml format)
* .bundlibrc.json
* .bundlibrc.yaml
* .bundlibrc.yml
* .bundlibrc.js
* bundlib.config.js
* bundlib.config.cjs
* bundlib.config.mjs
* bundlib.config.ts

See the [list of options](#options) below.

## Options

The option object may contain any of the following properties. Any invalid or unknown option will cause **Bundlib** to **throw** at build time. Any option or sub-option set to `null` will be ignored.

### option `input`

The path to the files to be used as entry points for each of your builds. This option supports [`value based selective format`](#value-based-selective-format).

```typescript
input: SelectiveStringOption;
```

See [`SelectiveStringOption`](#type-selectivestringoption).

### option `sourcemap`

Whether or not to generate source maps. Valid values are `boolean`, `"inline"` and `"hidden"`. The default value is `true` if you don't provide this option. See [Rollup documentation](https://rollupjs.org/guide/en/#outputsourcemap) for more information.

This option supports [value based](#value-based-selective-format) and [boolean based](#boolean-based-selective-format) selective format.

```typescript
sourcemap: SelectiveSourcemapOption;

default true;
```

See [`SelectiveSourcemapOption`](#type-selectivesourcemapoption).

### option `esModule`

Whether or not to add a `__esModule: true` property to your module. Valid values are `boolean` and `"if-default-prop"`. The default value is `false` if you don't provide this option.

This option supports [value based](#value-based-selective-format) and [boolean based](#boolean-based-selective-format) selective format.

```typescript
esModule: SelectiveEsModuleOption;

default false;
```

See [`SelectiveEsModuleOption`](#type-selectiveesmoduleoption).

### option `interop`

Whether or not to add an interop block. Valid values are `boolean`, `"default"`, `"esModule"`, `"compat"`, `"auto"` and `"defaultOnly"`. Rollup doesn't support `interop` option as a `boolean` anymore, we still support it by turning `true` into `"compat"` and `false` into `"default"` before we pass it to Rollup. The default value is `"default"` if you don't provide this option.

This option supports [value based](#value-based-selective-format) and [boolean based](#boolean-based-selective-format) selective format.

```typescript
interop: SelectiveInteropOption;

default "default";
```

See [`SelectiveInteropOption`](#type-selectiveinteropoption).

### option `chunks`

A map of chunks to be built as `CommonJS` modules. The object `key` represents the input file and the `value` represents the output file, relative to the project root. Files created using this option won't be bundled into the `CommonJS` and `Binary` builds and will be imported (required) instead.

```typescript
chunks: Record<string, string>;
```

### option `format`

Defines the format to be used for the `Browser` build.

```typescript
format: 'iife' | 'amd' | 'umd';

default 'umd';
```

### option `name`

The name to be used to expose your library to the global scope in a `IIFE` or `UMD` browser build. If not provided it will default to the camelcased, unscoped `"name"` field in `package.json` or the camelcased directory name. If none of those can be obtained, it will **throw** at build time.

```typescript
name: string;
```

### option `id`

```typescript
id: string;
```

Optional amd id for `AMD` or `UMD` build.

If not present, `AMD` `define` method will use no id.

### option `extend`

Whether or not to extend the globally exposed [name](#option-name) on a `IIFE` or `UMD` build.

```typescript
extend: boolean;

default false;
```

### option `globals`

`Object` or `array` to map names to globals in `Browser` build.

```typescript
globals: { [name: string]: string } | string[];

default {};
```

### option `min`

Defines which files should be used to build an additional minified version, if `true` will affect all modules. The minified file will be renamed from `*.ext` to `*.min.ext`. This option will override the default behavior of the [`--dev`, `-d` *cli option*](#--dev--d) , which means only the minified version will be actually minified, the normal version will **NOT** be minified even if you don't set the [`--dev`, `-d` cli option](#--dev--d). This option supports  [boolean based selective format](#boolean-based-selective-format).

```typescript
min: SelectiveMinOption;

default false;
```

See [`SelectiveMinOption`](#type-selectiveminoption).

### option `equals`

Transforms type export for CommonJS module using `export = ...` instead of `export default ...`.

> :warning: *Note that this option should only be used when your library has a* `default` *export and no* `named` *exports, otherwise it may cause the type declarations to become invalid.*

```typescript
equals: boolean;

default false;
```

### option `cache`

Defines the directory to be used for cache, relative to the project root.

```typescript
cache: string;

default "node_modules/.cache/bundlib";
```

### option `project`

Defines the location of typescript `tsconfig.json` file, relative to the project root. This option supports [value based selective format](#value-based-selective-format).

```typescript
project: SelectiveStringOption;

default "tsconfig.json"
```

See [`SelectiveStringOption`](#type-selectivestringoption).

### option `skip`

Defined which build **Bundlib** should skip. This option supports [boolean based selective format](#boolean-based-selective-format).

```typescript
min: SelectiveSkipOption;

default false;
```

See [`SelectiveSkipOption`](#type-selectiveskipoption).

## Selective Options

Some options support a `selective` format to allow for a more flexible configuration.

See [Selective Types](#selective-types) section for more information.

Note that some options support different selective formats. `Boolean` type options support `boolean` based format which is an extension of `value` based format, while others support only `value` based format.

See [`input` option](#option-input), [`sourcemap` option](#option-sourcemap), [`esModule` option](#option-esmodule), [`interop` option](#option-interop), [`min` option](#option-min) and [`project` option](#option-project).

### Value based selective format

The `value` based selective format allows you to enter a `value` or an `object` to set independent values.

#### As value

```typescript
const value: SelectiveValueBasedOption<BuildType, string> = 'string';
```

#### As nullish

```typescript
const value: SelectiveValueBasedOption<BuildType, string> = null;
const value: SelectiveValueBasedOption<BuildType, string> = undefined;
```

#### As object

```typescript
const value: SelectiveValueBasedOption<BuildType, string> = { main: 'string' };
const value: SelectiveValueBasedOption<BuildType, string> = { module: 'module' };
```

#### The special `default` property

You can override the default value as well using the `default` object key.

```typescript
const value: SelectiveValueBasedOption<BuildType, string> = {
  default: 'default',
  main: 'string',
};

const value: SelectiveValueBasedOption<BuildType, string> = {
  default: 'default',
  module: 'module',
};
```

#### The special `api` property

The `api` object key represents `main`, `module` and `browser`.

```typescript
const value: SelectiveValueBasedOption<BuildType, string> = {
  api: 'string',
};
```

### Boolean based selective format

The `boolean` based selective format is an extension of the a `value` based selective format, except `boolean` can be used as a value as well, and it allows `keys` in the `positive` or `negative` format in addition to what `value` based selective format normally accepts.

#### As boolean

You can set it to a `boolean` value.

```typescript
const value: SelectiveBoolBasedOption<BuildType, never> = true;
const value: SelectiveBoolBasedOption<BuildType, never> = false;
```

#### As key

You can set it to any of the valid keys, in the `positive` format (ex: `main` or `+main`) or `negative` format (ex: `!main` or `-main`). Valid keys are usually: `main`, `module`, `browser` and `bin` except for [`SelectiveSkipOption`](#type-selectiveskipoption) which also accepts `types` as key. It will also accepts [the special `api` key](#the-special-api-key).

```typescript
const value: SelectiveBoolBasedOption<BuildType, never> = 'main';
const value: SelectiveBoolBasedOption<BuildType, never> = 'api';
const value: SelectiveBoolBasedOption<BuildType, never> = '!api';
```

#### As array of keys

Any key that can be used as as [`single key`](#as-key), can be as well used in an array. The first key sets the default state for the result, and the additional keys extend that initial state.

```typescript
const value: SelectiveBoolBasedOption<BuildType, never> = ['main', 'module'];
const value: SelectiveBoolBasedOption<BuildType, never> = ['!browser', '!main'];
```

#### The special `api` key

The `api` special keys sets (or removes) `main`, `module` and `browser` at the same time.

```typescript
const value: SelectiveBoolBasedOption<BuildType, never> = 'api';
const value: SelectiveBoolBasedOption<BuildType, never> = ['api', '!browser'];
```

#### As value based

The `boolean` based selective format is an extension of the `value` based one. It accepts values as `boolean` and objects containing `boolean` values, in addition to what a `value` based selective format normally accepts.

```typescript
const value: SelectiveBoolBasedOption<BuildType, 'text'> = true;
const value: SelectiveBoolBasedOption<BuildType, 'text'> = { default: false, main: 'text' };
```

## Using the CLI tool

```bash
bundlib [options] [command]
```

### CLI Options

Combine options according to your needs. Run `bundlib --help` or `bundlib -h` for a detailed help.

#### `--dev`, `-d`

Create development, not minified builds. Builds affected by the [`min`](#option-min) option will ignore this option.

#### `--silent`, `-s`

Prevent messages from showing in the console.

#### `--version`, `-v`

Show **Bundlib** version.

#### `--help`, `-h`

Show detailed help about the CLI tool.

### CLI Commands

#### `build`

Build your library for production

#### `watch`

Runs Bundlib in watch mode

## Using Bundlib programmatically

Bundlib exposes some `function` and `types` you can `import`

***example***

```javascript
// rollup.config.js

import { configsFromPkg } from 'bundlib';

const dev = !process.env.production;

export default configsFromPkg(
  process.cwd(),
  { dev },
);
```

## Functions

### function `bundlib`

An All-in-one function combining `readPkg`, `analyzePkg` and `pkgToConfigs`. Just pass the directory where `package.json` is located, and it will return an array of Rollup configuration objects.

* *Syntax*

```typescript
async function bundlib(
  cwd: string,
  options?: BundlibAPIOptions | null | undefined,
): Promise<Array<rollup.RollupOptions>>;
```

* `arguments`
  * `cwd`: A string representing the path where `package.json` is located.
  * `options`: Some options to be passed to [`pkgToConfigs`](#function-pkgtoconfigs) function.
* `return`: An array of Rollup configs.

### function `readPkg`

Reads the content of `package.json` and returns it. It will throw a `TypeError` if `package.json` content is not an `object`.

* *Syntax*

```typescript
async function readPkg(cwd: string): Promise<PkgJson>;
```

* `arguments`
  * `cwd`: A string representing the path where `package.json` is located.
* `return`: A `Promise` which resolves to `package.json` content.

### function `analyzePkg`

Analyzes `package.json` content, resolve bundlib `configuration` and it turns it into more useful information about the build.

* *Syntax*

```typescript
async function analyzePkg(
  cwd: string,
  pkg: PkgJson,
): Promise<PkgAnalyzed>;
```

* `arguments`
  * `cwd`: A string representing the path where configuration file should be located.
  * `pkg`: The content of `package.json`.
* `return`: A `Promise` which resolves to information and tools, useful to configure rollup.

> If `pkg` not provided it will read `package.json` from the current working directory `cwd`. But this behavior will be removed in the future. So, to avoid problems in the future, please pass `pkg`

See [`PkgAnalyzed`](#type-pkganalyzed).

### function `pkgToConfigs`

Takes a [`PkgAnalyzed`](#type-pkganalyzed) object an turns it into an array of config objects, ready to be used by Rollup.

* *Syntax*

```typescript
function pkgToConfigs(
  analyzed: PkgAnalyzed,
  options?: BundlibAPIOptions | null | undefined,
): Array<rollup.RollupOptions>;
```

* `arguments`
  * `analyzed`: The [`PkgAnalyzed`](#type-pkganalyzed) returned by [`analyzePkg`](#function-analyzepkg) function.
  * `options`: Some options which define some configurations.
* `return`: An array of Rollup configs.

See [`PkgAnalyzed`](#type-pkganalyzed) and [`BundlibAPIOptions`](#type-bundlibapioptions).

### function `configsFromPkg`

Creates an array of rollup config object, based on the content of `package.json` and bundlib configuration file. It is a combination of [`readPkg`](#function-readpkg), [`analyzePkg`](#function-analyzepkg) and [`pkgToConfigs`](#function-pkgtoconfigs) functions. It is exported as a way to "do it all in one step", but you can use the independent functions to have a bit mor control over the process.

```typescript
async function configsFromPkg(
  cwd: string,
  options?: BundlibAPIOptions | null | undefined,
  pkg: PkgJson = read(cwd + '/package.json'),
): Promise<Array<rollup.RollupOptions>>;
```

* `arguments`
  * `cwd`: A string representing the path where `package.json` and configuration file should be located.
  * `options`: An object with options to create the configs.
  * `pkg`: The content of `package.json`.
* `return`: A `Promise` which resolves to information and tools, useful to configure rollup.

If `pkg` not provided it will be read from the current working directory `cwd`.

### function config

A function that returns it's only argument. It helps to have code completion and type check when using javascript config file.  See example.

```typescript
function config(config: BundlibConfig): BundlibConfig;
```

* *Example*

First the "normal" way...

```javascript
// bundlib.config.js

export default {
  input: 'src/index.js',
  interop: true,
  // ... the rest of your config here
};
```

... You can improve your experience by using this helper function... when using vscode, for example, it will type check and autocomplete your config file while you type.

```javascript
import { config } from 'bundlib';

export default config({
  input: 'src/index.js',
  interop: true,
  // ... the rest of your config here
});
```

## Types

This are som of the types exported but bundlib.

### type `BundlibConfig`

```typescript
interface BundlibConfig {
  readonly input?: SelectiveStringOption;
  readonly sourcemap?: SelectiveSourcemapOption;
  readonly esModule?: SelectiveEsModuleOption;
  readonly interop?: SelectiveInteropOption;
  readonly cache?: string | null;
  readonly chunks?: Record<string, string> | null;
  readonly format?: 'amd' | 'iife' | 'umd' | null;
  readonly name?: string | null;
  readonly id?: string | null;
  readonly extend?: boolean | null;
  readonly globals?: Record<string, string> | string[] | null;
  readonly equals?: boolean | null;
  readonly min?: SelectiveMinOption;
  readonly skip?: SelectiveSkipOption;
  readonly project?: SelectiveStringOption;
}
```

See options [`input`](#option-input), [`sourcemap`](#option-sourcemap), [`esModule`](#option-esmodule), [`interop`](#option-interop), [`cache`](#option-cache), [`chunks`](#option-chunks), [`format`](#option-format), [`name`](#option-name), [`id`](#option-id), [`extend`](#option-extend), [`globals`](#option-globals), [`equals`](#option-equals), [`min`](#option-min), [`skip`](#option-skip) and [`project`](#option-project), and types [`SelectiveStringOption`](#type-selectivestringoption), [`SelectiveSourcemapOption`](#type-selectivesourcemapoption), [`SelectiveEsModuleOption`](#type-selectiveesmoduleoption), [`SelectiveInteropOption`](#type-selectiveinteropoption), [`SelectiveMinOption`](#type-selectiveminoption) and [`SelectiveSkipOption`](#type-selectiveskipoption).

### type `PkgAnalyzed`

```typescript
interface PkgAnalyzed {
  cwd: string;
  pkg: PkgJson;
  main: ModuleBuildOptions | null;
  module: ModuleBuildOptions | null;
  browser: BrowserBuildOptions | null;
  bin: ModuleBuildOptions | null;
  types: TypesBuildOptions | null;
  chunks: Record<string, string> | null;
  dependencies: {
    runtime: PkgJsonDependencies | null;
    dev: PkgJsonDependencies | null;
    peer: PkgJsonDependencies | null;
  };
  cache: string | null;
  isInstalled: (id: string) => string | undefined;
  installed: {
    babel: { id: '@babel/core'; version: string } | null;
    eslint: { id: 'eslint'; version: string } | null;
    chokidar: { id: 'chokidar'; version: string } | null;
    typescript: { id: 'typescript'; version: string } | null;
  };
}
```

See [`ModuleBuildOptions`](#type-modulebuildoptions), [`BrowserBuildOptions`](#type-browserbuildoptions) and [`TypesBuildOptions`](#type-browserbuildoptions)

### type `ModuleBuildOptions`

```typescript
interface ModuleBuildOptions {
  input: string | null;
  output: string;
  sourcemap: boolean | 'inline' | 'hidden';
  esModule: boolean | 'if-default-prop';
  interop: boolean | 'compat' | 'auto' | 'esModule' | 'default' | 'defaultOnly';
  min: boolean;
  project: string | null;
}
```

### type `BrowserBuildOptions`

```typescript
interface BrowserBuildOptions extends ModuleBuildOptions {
  format: 'iife' | 'amd' | 'umd';
  name: string | null;
  id: string | null;
  globals: Record<string, string> | null;
  extend: boolean;
}
```

See [`ModuleBuildOptions`](#type-modulebuildoptions).

### type `TypesBuildOptions`

```typescript
interface TypesBuildOptions {
  output: string;
  equals: boolean;
}
```

### type `BundlibAPIOptions`

```typescript
export interface BundlibAPIOptions {
  dev?: boolean;
  watch?: boolean;
  onwarn?: rollup.WarningHandlerWithDefault;
}
```

## Selective Types

### type `SelectiveValueBasedOption`

```typescript
type SelectiveValueBasedOption<K extends string, V> = ValueBasedSelectiveOption<K, 'api' | 'default', V>;
```

See [`ValueBasedSelectiveOption`](https://github.com/manferlo81/selective-option?tab=readme-ov-file#type-valuebasedselectiveoption) on [selective-option](https://github.com/manferlo81/selective-option) module.

### type `SelectiveBoolBasedOption`

```typescript
type SelectiveBoolBasedOption<K extends string, V> = BoolBasedSelectiveOption<K, 'api', V, 'default'>;
```

See [`BoolBasedSelectiveOption`](https://github.com/manferlo81/selective-option?tab=readme-ov-file#type-boolbasedselectiveoption) on [selective-option](https://github.com/manferlo81/selective-option) module.

### type `BuildType`

```typescript
type BuildType =  'main' | 'module' | 'browser' | 'bin';
```

### type `SelectiveStringOption`

```typescript
type SelectiveStringOption = SelectiveValueBasedOption<BuildType, string>;
```

See [`SelectiveValueBasedOption`](#type-selectivevaluebasedoption) and [`BuildType`](#type-buildtype).

### type `SelectiveSourcemapOption`

```typescript
type SelectiveSourcemapOption = SelectiveBoolBasedOption<BuildType, 'inline' | 'hidden'>;
```

See [`SelectiveBoolBasedOption`](#type-selectiveboolbasedoption) and [`BuildType`](#type-buildtype).

### type `SelectiveEsModuleOption`

```typescript
type SelectiveEsModuleOption = SelectiveBoolBasedOption<BuildType, 'if-default-prop'>;
```

See [`SelectiveBoolBasedOption`](#type-selectiveboolbasedoption) and [`BuildType`](#type-buildtype).

### type `SelectiveInteropOption`

```typescript
type SelectiveInteropOption = SelectiveBoolBasedOption<BuildType, 'default' | 'esModule' | 'compat' | 'auto' | 'defaultOnly'>;
```

See [`SelectiveBoolBasedOption`](#type-selectiveboolbasedoption) and [`BuildType`](#type-buildtype).

### type `SelectiveMinOption`

```typescript
type SelectiveMinOption = SelectiveBoolBasedOption<BuildType, never>;
```

See [`SelectiveBoolBasedOption`](#type-selectiveboolbasedoption) and [`BuildType`](#type-buildtype)

### type `SelectiveSkipOption`

```typescript
type SelectiveSkipBuildType = BuildType | 'types';
type SelectiveSkipOption = SelectiveBoolBasedOption<SelectiveSkipBuildType, never>;
```

See [`SelectiveBoolBasedOption`](#type-selectiveboolbasedoption) and [`BuildType`](#type-buildtype)

## Plugin Notes

### plugin `@rollup/plugin-eslint`

Because `@rollup/plugin-eslint` uses it's own version of `eslint` (maybe not the same version you are using in your project), you may need to use the `"overrides"` property of your `package.json` to ensure `@rollup/plugin-eslint` uses the same version you are using inside your project.

```json
{
  "devDependencies": {
    "eslint": "^9.10.0"
  },
  "overrides": {
    "eslint": "^9.10.0"
  }
}
```

### plugin `rollup-plugin-typescript2`

Some values from your `tsconfig.json` file `"compilerOptions"` will be ignored or overridden by `Bundlib`.

#### `"module"`

`"module"` option will be set to `"ESNext"`.

#### `"sourceMap"`

`"sourceMap"` option will be set according to your [`sourcemap` option](#option-sourcemap) or it's default value.

#### `"declaration"`, `"declarationDir"` and `"declarationMap"`

`"declaration"` and `"declarationDir"` will be set according to your settings, trying to ensure it follows your `package.json` and configuration. `"declarationMap"` will be set to `true` if your declaration files are being emitted.

## Features

* Uses `"main"` field in your `package.json` to build a `CommonJS Module`.
* Uses `"module"` field in your `package.json` (or `"jsnext:main"` field) to build an `ES Module`.
* Uses `"browser"` field in your `package.json` to build a `Browser` module. It only supports `"browser"` field as `string`, `object` format not supported.
* Uses `"bin"` field in your `package.json` to build a `Binary` module. It only supports `"bin"` field as `string`, `object` format not supported.
* Uses `"types"` field in your `package.json` (or `"typings"` field) as path for types declarations.
* Uses `"dependencies"` and `"peerDependencies"` to set external modules for `CommonJS Module`, `ES Module` and `Binary` builds. Dependencies will be bundled by default in `Browser` builds, unless otherwise specified using the [`global`](#option-globals) option.
* Skip any build based on [options](#option-skip).
* Uses [`rollup-plugin-typescript2`](https://www.npmjs.com/package/rollup-plugin-typescript2) if [`typescript`](https://www.npmjs.com/package/typescript) installed as runtime or dev dependency.
* Uses [`@rollup/plugin-babel`](https://www.npmjs.com/package/@rollup/plugin-babel) if [`@babel/core`](https://www.npmjs.com/package/@babel/core) installed as runtime or dev dependency, otherwise it uses [`@rollup/plugin-buble`](https://www.npmjs.com/package/@rollup/plugin-buble).
* Uses [`rollup-plugin-strip-shebang`](https://www.npmjs.com/package/rollup-plugin-strip-shebang) and [`rollup-plugin-add-shebang`](https://www.npmjs.com/package/rollup-plugin-add-shebang) to ensure a shebang on binary build.
* Uses [`@rollup/plugin-json`](https://www.npmjs.com/package/@rollup/plugin-json) to import JSON files.
* Uses[`@rollup/plugin-eslint`](https://www.npmjs.com/package/@rollup/plugin-eslint) if [`eslint`](https://www.npmjs.com/package/eslint) installed as runtime or dev dependency.
* Uses [`@rollup/plugin-terser`](https://www.npmjs.com/package/@rollup/plugin-terser) to minify production build.
* Uses [`chokidar`](https://www.npmjs.com/package/chokidar) for file watch if installed.

## Future Features

* Honor `"type"` field in `package.json`
* Honor `"exports"` field in `package.json`
* Support `package.json` `"bin"` field as an object for multiple cli commands

## Known issues

* Type declarations for chunks created using the [`chunks`](#option-chunks) option may not work properly.

## License

[MIT](LICENSE) &copy; 2019-2024 [Manuel Fernández](https://github.com/manferlo81)
