# Bundlib

[![CircleCI](https://circleci.com/gh/manferlo81/bundlib.svg?style=svg)](https://circleci.com/gh/manferlo81/bundlib) [![dependabot](https://api.dependabot.com/badges/status?host=github&repo=manferlo81/bundlib)](https://dependabot.com) [![npm](https://badgen.net/npm/v/bundlib)](https://www.npmjs.com/package/bundlib) [![codecov](https://codecov.io/gh/manferlo81/bundlib/branch/master/graph/badge.svg)](https://codecov.io/gh/manferlo81/bundlib) [![dependencies](https://badgen.net/david/dep/manferlo81/bundlib)](https://david-dm.org/manferlo81/bundlib) [![dev dependencies](https://badgen.net/david/dev/manferlo81/bundlib)](https://david-dm.org/manferlo81/bundlib?type=dev) [![packagephobia](https://badgen.net/packagephobia/install/bundlib)](https://packagephobia.now.sh/result?p=bundlib) [![types](https://img.shields.io/npm/types/bundlib.svg)](https://github.com/microsoft/typescript) [![Known Vulnerabilities](https://snyk.io/test/npm/bundlib/badge.svg)](https://snyk.io/test/npm/bundlib) [![license](https://badgen.net/github/license/manferlo81/bundlib)](LICENSE)

An automatic configuration manager for [Rollup.js](https://github.com/rollup/rollup).

> :warning: **Bundlib** is under active development, please [file a new issue](https://github.com/manferlo81/bundlib/issues) if you find any issue or bug, suggestions are welcome as well.

## BREAKING CHANGES in version 0.16.x

* `analizePkg` result format changed, see [PkgAnalized](#pkganalized) (It only affects you if you are using **Bundlib** programmatically)

## In this guide

* [Install](#install)
* [Build](#build)
* [Configuration](#configuration)
* [Advanced Configuration](#advanced-configuration)
* [Options](#options)
  * [input](#input)
  * [sourcemap](#sourcemap)
  * [esModule](#esmodule)
  * [interop](#interop)
  * [format](#format)
  * [name](#name)
  * [id](#id)
  * [extend](#extend)
  * [globals](#globals)
  * [min](#min)
  * [cache](#cache)
  * [project](#project)
  * [skip](#skip)
* [Selective Options](#selective-options)
  * [Object based selective format](#object-based-selective-format)
  * [String based selective format](#string-based-selective-format)
* [Supported Plugins](#supported-plugins)
* [Using the CLI tool](#using-the-cli-tool)
* [Using **Bundlib** programmatically](#using-bundlib-programmatically)
* [Types](#types)
* [Features](#features)

## Install

```bash
npm i -D bundlib rollup
```

> :warning: [**Rollup**](#https://github.com/rollup/rollup) is a peer dependency and it has to be installed as well.

## Build

**Bundlib** will try to find your entry point file in the **`src`** folder. You can manually set your entry points using the [`input`](#input) options.

### CommonJS module

To build a `CommonJS Module` simply add a `"main"` field to your `package.json` pointing to the output file, [see the configuration section](#configuration) for extra options.

### ES module

To build a `ES Module` add a `"module"` field to your `package.json` pointing to the output file, [see the configuration section](#configuration) for extra options.

### IIFE, AMD and UMD build

For `IIFE`, `AMD` or `UMD` builds, add a `"browser"` field to your `package.json`. The default format is `"umd"` but it can be changed to `"iife"` or `"amd"` using the [`format`](#format) option, see the [configuration section](#configuration) for more info.

## Configuration

### Automatic Configuration

**Bundlib** will configure [**Rollup**](https://github.com/rollup/rollup) according to you `package.json` data, see [Advanced Configuration](#advanced-configuration) for more information.

#### "main"

The `"main"` field will be used as your **CommonJS module** output, if not present, **CommonJS Module** build will be skipped. You can skip the build manually using the [`skip`](#skip) advanced option.

#### "module" or "jsnext:main"

The `"module"` field will be used as your **ES Module** output, if not present, **ES Module** build will be skipped. You can skip the build manually using the [`skip`](#skip) advanced option. `"jsnext:main"` field will also be honored if `"module"` field is not present, but it is recommended to use the `"module"` field.

#### "browser"

The `"browser"` field will be used as your **Browser** build output, if not present, **Browser** build will be skipped. You can skip the build manually using the [`skip`](#skip) advanced option. **Bundlib** only supports `string` type `"browser"` field, it will **throw** otherwise.

#### "bin"

The `"bin"` field will be used as your **Binary** build output, if not present, **Binary** build will be skipped. You can skip the build manually using the [`skip`](#skip) advanced option. **Bundlib** only supports `string` type `"bin"` field, it will **throw** otherwise.

#### "types" or "typings"

The `"types"` field will be used as your **Types** output if you are using `typescript`. You can skip types generation using the [`skip`](#skip) advanced option. `"typings"` field will also be honored if `"types"` field is not present.

#### "dependencies"

The `"dependencies"` field will be used to detect installed packages, it will also be used to set external dependencies for your **CommonJS module**, **ES module**, and **Binary** builds, for **Browser** build dependencies will be bundled into the output file unless otherwise specified using the [`"globals"`](#globals) advanced option.

#### "devDependencies"

The `"devDependencies"` field will be used to detect installed packages.

#### "peerDependencies"

The `"peerDependencies"` field will be used as external dependencies for your **CommonJS module,**, **ES module**, and **Binary** builds.

#### "bundlib"

The `"bundlib"` field can be used for advanced configuration, see [Advanced Configuration](#advanced-configuration) for more information.

### Advanced Configuration

Advanced configuration can be done using the `"bundlib"` field in your `package.json` or by using one of the [configuration files](#configuration-files).

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

You can also set `"bundlib"` field in `package.json` to a `string` as a path, relative to the project root, pointing to a `.json`, `.yaml`, `.yml` or `.js` configuration file.

***example***

```json
// package.json
{
  "name": "my-lib",
  "version": "1.0.0",
  "browser" : "dist/my-lib.amd.js",
  "bundlib": "custom-options.yaml"
  // ...
}
```

then...

```yaml
# custom-options.yaml
format: amd
```

#### Configuration files

If `"bundlib"` field not present, **Bundlib** will try to find your configuration file using the following order...

* .bundlibrc (json or yaml format)
* .bundlibrc.json
* .bundlibrc.yaml
* .bundlibrc.yml
* .bundlibrc.js
* bundlib.config.js

See the [list of options](#options) below.

### Options

The option object may contain any of the following properties. Any invalid or unknown option will cause **Bundlib** to **throw** at build time. Any option or sub-option set to `null` will be ignored.

#### input

```typescript
input: string | SelectiveOption;
```

The path to the files to be used as entry points for each of your builds.

This option supports `object` based [`selective format`](#selective-options). See [Selective Options](#selective-options) for more information.

#### sourcemap

```typescript
sourcemap: boolean | 'inline' | 'hidden' | SelectiveOption;

default true;
```

Whether or not to generate source maps, See [Rollup documentation](https://rollupjs.org/guide/en/#outputsourcemap) for more information. If not specified or set to `null` it will default to `true`.

This option supports `object` based and `string` based [`selective format`](#selective-options). See [Selective Options](#selective-options) for more information.

#### esModule

```typescript
esModule: boolean | SelectiveOption;

default false;
```

Whether or not to add a `__esModule: true` property to your module. If `esModule = true` it will affect all builds.

This option supports `object` based and `string` based [`selective format`](#selective-options). See [Selective Options](#selective-options) for more information.

#### interop

```typescript
interop: boolean | SelectiveOption;

default false;
```

Whether or not to add an interop block. If `interop = true` it will affect all builds.

This option supports `object` based and `string` based [`selective format`](#selective-options). See [Selective Options](#selective-options) for more information.

#### min

```typescript
min: boolean | SelectiveOption;

default false;
```

Defines which files should be used to build an aditional minified version, if `true` will affect all modules. The minified file will be renamed from `*.ext` to `*.min.ext`. This option will override the default behavior of the [`--dev`, `-d` *cli option*](#-dev-d) , which means only the minified version will be actually minified, the normal version will **NOT** be minified even if you don't set the [`--dev`, `-d` cli option](#-dev-d).

This option supports `object` based and `string` based [`selective format`](#selective-options). See [Selective Options](#selective-options) for more information.

#### format

```typescript
format: "iife" | "amd" | "umd";

default "umd";
```

Defines the format to be used for the `Browser` build.

#### name

```typescript
name: string;
```

The name to be used to expose your library to the global scope in a `IIFE` or `UMD` browser build. If not provided it will default to the camelcased, unscoped `"name"` field in `package.json` or the camelcased directory name. If none of those can be obtained, it will **throw** at build time.

#### id

```typescript
id: string;
```

Optional amd id for `AMD` or `UMD` build.

If not present, `AMD` `define` method will use no id.

#### extend

```typescript
extend: boolean;

default false;
```

Whether or not to extend the globally exposed [name](#name) on a `IIFE` or `UMD` build.

#### globals

```typescript
globals: { [name: string]: string } | string[];

default {};
```

`Object` or `array` to map names to globals in `Browser` build.

#### cache

```typescript
cache: string;

default "node_modules/.cache/bundlib"
```

Defines the directory to be used for cache, relative to the project root.

#### project

```typescript
project: string | SelectiveOption;

default "tsconfig.json"
```

Defines the location of typescript `tsconfig.json` file, relative to the project root.

This option supports `object` based [`selective format`](#selective-options). See [Selective Options](#selective-options) for more information.

#### skip

```typescript
min: boolean | SelectiveOption;

default false;
```

Defined which build **Bundlib** should skip.

This option supports `object` based and `string` based [`selective format`](#selective-options). See [Selective Options](#selective-options) for more information.

### Selective Options

Some options support a selective format to allow for a more flexible configuration. See [`SelectiveOption`](#SelectiveOption) type for more information.

Note that some options support different selective formats. `Boolean` type options support `string` based format and `object` based format while others support only `object` based format.

See [input](#input), [sourcemap](#sourcemap), [esModule](#esmodule), [interop](#interop), [min](#min) and [project](#project) options.

#### Object based selective format

`object` based format works by preserving the default value and overiding it with the provided configuration.

***example***

```javascript
// assuming default = false

resolveSelectiveOption({
  main: true
});

/*
{
  main: true,
  ...others: false
}
*/
```

##### The special `default` property

You can override the default value as well using the `"default"` object key.

***example***

```javascript
// assuming default = false

resolveSelectiveOption({
  default: true,
  bin: false
});

/*
{
  bin: false,
  ...others: true
}
*/
```

##### The special `api` property

The `"api"` object key represents `main`, `module` and `browser`.

***example***

```javascript
// assuming default = false

resolveSelectiveOption({
  api: true
});

/*
{
  main: true,
  module: true,
  browser: true,
  ...others: false
}
*/
```

#### String based selective format

`string` based format works in a different way, it does not preserve the default value, included build types will be set to `true` and the others will be set to `false`. It can be a `string` or an `string array`.

##### As string

***example***

```javascript
resolveSelectiveOption('module');

/*
{
  module: true,
  ...others: false
}
*/
```

##### As array of strings

***example***

```javascript
resolveSelectiveOption(['main', 'module']);

/*
{
  main: true,
  module: true,
  ...others: false
}
*/
```

##### The special `api` build type

***example***

```javascript
resolveSelectiveOption('api');

/*
{
  main: true,
  module: true,
  browser: true,
  ...others: false
}
*/
```

## Supported Plugins

Any of the following plugins will be automatically configured if they are installed as `"dependencies"` or `"devDependencies"` in `package.json`.

* [`@rollup/plugin-typescript`](https://github.com/rollup/plugins/tree/master/packages/typescript)
* [`@rollup/plugin-babel`](https://github.com/rollup/plugins/tree/master/packages/babel)
* [`@rollup/plugin-buble`](https://github.com/rollup/plugins/tree/master/packages/buble)
* [`@rollup/plugin-node-resolve`](https://github.com/rollup/plugins/tree/master/packages/node-resolve)
* [`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs)
* [`@rollup/plugin-json`](https://github.com/rollup/plugins/tree/master/packages/json)
* [`rollup-plugin-eslint`](https://github.com/TrySound/rollup-plugin-eslint)
* [`rollup-plugin-typescript2`](https://github.com/ezolenko/rollup-plugin-typescript2)
* [`rollup-plugin-export-equals`](https://github.com/manferlo81/rollup-plugin-export-equals)

Any plugin suggestion will be well received, please [file a new issue](https://github.com/manferlo81/bundlib/issues).

## Using the CLI tool

```bash
bundlib [options]
```

### CLI Options

Combine options according to your needs. Run `bundlib --help` or `bundlib -h` for a detailed help.

#### `--dev`, `-d`

Create development, not minified builds. Builds affected by the [`min`](#min) option will ignore this option.

#### `--watch`, `-w`

Run **Bundlib** in watch mode.

#### `--silent`, `-s`

Prevent messages from showing in the console.

#### `--version`, `-v`

Show **Bundlib** version.

#### `--help`, `-h`

Show detailed help about the CLI tool.

## Using Bundlib programmatically

***example***

```javascript
// rollup.config.js

import { configsFromPkg } from "bundlib";

const dev = !process.env.production;

export default configsFromPkg(
  process.cwd(),
  { dev },
);
```

### analizePkg

```typescript
function analizePkg(
  cwd: string,
  pkg: PkgJson = read(cwd + "/package.json"),
): Promise<PkgAnalized>;
```

Analizes `package.json` and returns a `Promise` that resolves to useful normalized information, [*see* `PkgAnalized`](#pkganalized). If `pkg` not provided it will be read from the current working directory `cwd`.

### configsFromPkg

```typescript
function configsFromPkg(
  cwd: string,
  options: { dev? boolean, watch?: boolean } | null | false,
  pkg: PkgJson = read(cwd + "/package.json"),
): Promise<RollupOptions[]>;
```

Returns a `Promise` that resolves to an array of Rollup configs based on the content of `package.json`. If `pkg` not provided it will be read from the current working directory `cwd`.

## Types

### PkgAnalized

```typescript
interface PkgAnalized {
  cwd: string;
  pkg: PkgJson;
  main: ModuleBuildOptions | null;
  module: ModuleBuildOptions | null;
  browser: BrowserBuildOptions | null;
  bin: ModuleBuildOptions | null;
  types: string | null;
  dependencies: {
    runtime: { [name: string]: string } | null;
    dev: { [name: string]: string } | null;
    peer: { [name: string]: string } | null;
  };
  cache: string | null;
}
```

*see also:* [`ModuleBuildOptions`](#modulebuildoptions) and [`BrowserBuildOptions`](#browserbuildoptions).

### ModuleBuildOptions

```typescript
interface ModuleBuildOptions {
  input: string | null;
  output: string;
  sourcemap: boolean | 'inline' | 'hidden';
  esModule: boolean;
  interop: boolean;
  min: boolean;
  project: string | null;
}
```

### BrowserBuildOptions

```typescript
interface BrowserBuildOptions extends ModuleBuildOptions {
  format: "iife" | "amd" | "umd";
  name: string | null;
  id: string | null;
  globals: Record<string, string> | null;
  extend: boolean;
}
```

### SelectiveOption

```typescript
interface ObjectBasedSelectiveOption<T> {
  default: T;
  [K: BuildType]: T;
}

type StringBasedSelectiveOption = BuildType | BuildType[];

type BuildType = 'main' | 'module' | 'browser' | 'bin' | 'api' | ...others;
```

## Features

* Uses `"main"` field in your `package.json` to build a `CommonJS Module`.
* Uses `"module"` field in your `package.json` (or `"jsnext:main"` field) to build an `ES Module`.
* Uses `"browser"` field in your `package.json` to build a `Browser` module. It only supports `"browser"` field as `string`, `object` format not supported.
* Uses `"bin"` field in your `package.json` to build a `Binary` module. It only supports `"bin"` field as `string`, `object` format not supported.
* Uses `"types"` field in your `package.json` (or `"typings"` field) as path for types declarations.
* Uses `"dependencies"` and `"peerDependencies"` to set external modules for `CommonJS Module`, `ES Module` and `Binary` builds. Dependencies will be bundled by default in `Browser` builds, unless otherwise specified using the [`global`](#globals) option.
* Skip any build based on [options](#skip).
* Uses and configures any installed [supported rollup plugin](#supported-plugins).
* Uses `chokidar` for file watch if installed.

## License

[MIT](LICENSE) &copy; 2019 [Manuel Fernández](https://github.com/manferlo81)
