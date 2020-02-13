# Bundlib

[![CircleCI](https://circleci.com/gh/manferlo81/bundlib.svg?style=svg)](https://circleci.com/gh/manferlo81/bundlib) [![dependabot](https://api.dependabot.com/badges/status?host=github&repo=manferlo81/bundlib)](https://dependabot.com) [![npm](https://badgen.net/npm/v/bundlib)](https://www.npmjs.com/package/bundlib) [![codecov](https://codecov.io/gh/manferlo81/bundlib/branch/master/graph/badge.svg)](https://codecov.io/gh/manferlo81/bundlib) [![dependencies](https://badgen.net/david/dep/manferlo81/bundlib)](https://david-dm.org/manferlo81/bundlib) [![dev dependencies](https://badgen.net/david/dev/manferlo81/bundlib)](https://david-dm.org/manferlo81/bundlib?type=dev) [![packagephobia](https://badgen.net/packagephobia/install/bundlib)](https://packagephobia.now.sh/result?p=bundlib) [![types](https://img.shields.io/npm/types/bundlib.svg)](https://github.com/microsoft/typescript) [![Known Vulnerabilities](https://snyk.io/test/npm/bundlib/badge.svg)](https://snyk.io/test/npm/bundlib) [![license](https://badgen.net/github/license/manferlo81/bundlib)](LICENSE)

A javascript library bundler powered by [Rollup.js](https://github.com/rollup/rollup) and optionally [Typescript](https://github.com/Microsoft/TypeScript).

> :warning: Bundlib is under active development, please [file a new issue](https://github.com/manferlo81/bundlib/issues) if you find any issue or bug, suggestions are welcome as well.

## BREAKING CHANGES in version 0.14.x

### API

* `analizePkg` result `dependencies` member contains a set of objects in the form `{ name: version }` ([*see* `PkgAnalized`](#pkganalized)) allowing more control over installed dependencies and faster dependency detection. If you are using `Bundlib` via `CLI` you won't be affected by this change.

## In this guide

* [Install](#install)
* [First steps](#first-steps)
* [Build](#build)
* [Configuration](#configuration)
* [CLI](#cli)
* [API](#api)
* [Types](#types-1)
* [Known Issues](#known-issues)
* [Features](#features)

## Install

```bash
npm i -D bundlib
```

## First steps

Bundlib will use `src/index.ts` as entry file for your library by default, it can be configured using the [`input`](#input) option. Add the corresponding scripts to your `package.json` and run them. [see below for CLI options](#cli).

## Build

### CommonJS module

Building a `CommonJS Module` is as simple as adding a `"main"` field to your `package.json` pointing to the output file, [see the configuration section](#configuration) for extra options.

### ES module

To build a `ES Module` simply add a `"module"` field to your `package.json` pointing to the output file, [see the configuration section](#configuration) for extra options.

### IIFE, AMD and UMD build

For `IIFE`, `AMD` or `UMD` builds, add a `"browser"` field to your `package.json`. The default format is `"umd"` but it can be changed to `"iife"` or `"amd"` using the [`format`](#format) or [`browser`](#browser) option, see the [configuration section](#configuration) for more info.

## Configuration

Configuration is done through the `"bundlib"` field in your `package.json`. See the [list of options](#options) below.

***example***

```javascript
// package.json
{
  "version": "1.0.0",
  "name": "my-lib",
  "browser" : "dist/my-lib.amd.js",
  // ...
  "bundlib": {
    "format": "amd"
  }
  // ...
}
```

### Options

The `"bundlib"` field in `package.json` may contain any of the following properties. Any invalid or unknown option will cause `Bundlib` to throw at build time. Any option or sub-option set to `null` will be ignored.

#### input

```typescript
input: string | InputOptions;

interface InputOptions {
  api?: string;
  bin?: string;
}

default {
  api: "src/index.ts";
  bin: "src-bin/index.ts";
};
```

The path to the file (or files) to be used as entry point(s) for `API` and `Binary` modules. If a `string` is provided, it will be used as `API` entry point and `Binary` entry point will be set to the default value.

#### sourcemap

```typescript
sourcemap: boolean | "inline";

default true;
```

Whether or not to generate source maps. Anything other than `false` or `"inline"` will default to `true`.

This option can be overridden using `per-build` options. See [`main`](#main), [`module`](#module), [`browser`](#browser) and [`bin`](#bin) options.

#### esModule

```typescript
esModule: BuildType | BuildType[] | boolean;

type BuildType = "main" | "browser" | "min";

default false;
```

Whether or not to add a `__esModule: true` property to your `non ES Module` build. If `esModule = true` it will affect all supported builds.

This option can be overridden using `per-build` options. See [`main`](#main), [`browser`](#browser) and [`bin`](#bin) options.

#### interop

```typescript
interop: BuildType | BuildType[] | boolean;

type BuildType = "main" | "browser" | "min";

default false;
```

Whether or not to add an interop block. If `interop = true` it will affect all supported builds.

This option can be overridden using `per-build` options. See [`main`](#main), [`browser`](#browser) and [`bin`](#bin) options.

#### format

```typescript
format: "iife" | "amd" | "umd";

default "umd";
```

Defines the format to be used for the `Browser` build.

This option can be overridden using the [`browser`](#browser) option.

#### name

```typescript
name: string;
```

The name to be used to expose your library to the global scope in a `IIFE` or `UMD` browser build. If not provided it will default to the camelcased, unscoped `"name"` field in `package.json` or the camelcased directory name. If none of those can be obtained, it will throw at build time.

This option can be overridden using the [`browser`](#browser) option.

#### id

```typescript
id: string;
```

Optional amd id for `AMD` or `UMD` build.

This option can be overridden using the [`browser`](#browser) option.

If not present, `AMD` module will be defined with no id.

#### extend

```typescript
extend: boolean;

default false;
```

Whether or not to extend the globally exposed name on a `IIFE` or `UMD` build.

This option can be overridden using the [`browser`](#browser) option.

#### globals

```typescript
globals: { [name: string]: string } | string[];

default {};
```

Object or array to map names to globals in `Browser` build.

This option can be overridden using the [`browser`](#browser) option.

#### equals

```typescript
equals: boolean;

default false;
```

Transforms type export for CommonJS module using `export = ...` instead of `export default ...`.

This option can be overridden using the [`types`](#types) option.

> :warning: *Note that this option should only be used when your library has a* `default` *export and no* `named` *exports, otherwise it may cause the type declarations to become invalid.*

#### min

```typescript
min: BuildType | BuildType[] | boolean;

type BuildType = "main" | "module" | "browser" | "min";

default false;
```

Defines which files should be used to build an aditional minified version, if `true` will affect all modules. The minified file will be renamed from `*.ext` to `*.min.ext`. This option will override the default behavior of the [`--dev`, `-d` *cli option*](#-dev-d) , which means only the minified version will be actually minified, the normal version will **NOT** be minified even if you don't set the [`--dev`, `-d` cli option](#-dev-d).

This option can be overridden using `per-build` options. See [`main`](#main), [`module`](#module), [`browser`](#browser) and [`bin`](#bin) options.

#### cache

```typescript
cache: string;

default "node_modules/.cache/bundlib"
```

Defines the directory to be used for cache, relative to the project root.

#### main

```typescript
main: CommonJSOptions | false;

interface CommonJSOptions {
  sourcemap?: boolean | "inline";
  esModule?: boolean | null;
  interop?: boolean | null;
  min?: boolean | null;
}
```

Specific options to be used in the `CommonJS` build. They will override any corresponding option set in the top-level options. See [`sourcemap`](#sourcemap), [`esModule`](#esmodule), [`interop`](#interop) and [`min`](#min) options.

If it's set to `false`, it will prevent `CommonJS` build altogether, even if there is a `"main"` field in `package.json`.

#### module

```typescript
module: ESModuleOptions | false;

interface ESModuleOptions {
  sourcemap?: boolean | "inline";
  min?: boolean;
}
```

Specific options to be used in the `ES Module` build. They will override any corresponding option set in the top-level options. See [`sourcemap`](#sourcemap) and [`min`](#min) options.

If it's set to `false`, it will prevent `ES Module` build altogether, even if there is a `"module"` or `"jsnext:main"` field in `package.json`.

#### browser

```typescript
browser: BrowserOptions | false;

interface BrowserOptions {
  sourcemap?: boolean | "inline";
  esModule?: boolean;
  interop?: boolean;
  min?: boolean;
  format?: "iife" | "amd" | "umd" ;
  name?: string;
  id?: string;
  extend?: boolean;
  globals?: { [name: string]: string } | string[];
}
```

Specific options to be used in the `Browser` build. They will override any corresponding option set in the top-level options. See [`sourcemap`](#sourcemap), [`esModule`](#esmodule), [`interop`](#interop), [`min`](#min), [`format`](#format), [`name`](#name), [`id`](#id), [`extend`](#extend) and [`globals`](#globals) options.

If it's set to* `false`, it will prevent `Browser` build altogether, even if there is a `"browser"` field in `package.json`.

#### bin

```typescript
bin: CommonJSOptions | false;

interface CommonJSOptions {
  sourcemap?: boolean | "inline";
  esModule?: boolean;
  interop?: boolean;
  min?: boolean;
}
```

Specific options to be used in `Binary` build. They will override any corresponding option set in the top-level options. See [`sourcemap`](#sourcemap), [`esModule`](#esmodule), [`interop`](#interop) and [`min`](#min) options.

If it's set to `false`, it will prevent `Binary` build altogether, even if there is a `"bin"` field in `package.json`.

#### types

```typescript
types: TypesOptions | false;

interface TypesOptions {
  equals: boolean;
}
```

Specific options to be used for types generation. They will override any corresponding option set in the top-level options. See [`equals`](#equals) option.

If it's set to `false`, it will prevent type declarations generation altogether, even if there is a `"types"` or `"typings"` field in `package.json`.

## CLI

```bash
bundlib [options]
```

### CLI Options

Combine options according to your needs. Run `bundlib --help` or `bundlib -h` for a detailed help.

#### `--dev`, `-d`

Create development, not minified builds. Builds affected by the [`min`](#min) option will ignore this option.

#### `--watch`, `-w`

Run `bundlib` in watch mode.

#### `--silent`, `-s`

Prevent messages from showing in the console.

#### `--version`, `-v`

Show `bundlib` version.

#### `--help`, `-h`

Show detailed help about the CLI tool.

## API

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
  input: {
    api: string;
    bin: string;
  };
  output: {
    main: CommonJSBuildOptions | null;
    module: ESModuleBuildOptions | null;
    browser: BrowserBuildOptions | null;
    bin: CommonJSBuildOptions | null;
    types: TypesBuildOptions | null;
  };
  dependencies: {
    runtime: { [name: string]: string } | null;
    dev: { [name: string]: string } | null;
    peer: { [name: string]: string } | null;
    optional: { [name: string]: string } | null;
  };
  cache: string;
}
```

*see also:* [`CommonJSBuildOptions`](#commonjsbuildoptions), [`ESModuleBuildOptions`](#esmodulebuildoptions), [`BrowserBuildOptions`](#browserbuildoptions) & [`TypesBuildOptions`](#typesbuildoptions)

### CommonJSBuildOptions

```typescript
interface CommonJSBuildOptions {
  path: string;
  sourcemap: boolean | "inline";
  esModule: boolean;
  interop: boolean;
  min: boolean;
}
```

### ESModuleBuildOptions

```typescript
interface ESModuleBuildOptions {
  path: string;
  sourcemap: boolean | "inline";
  min: boolean;
}
```

### BrowserBuildOptions

```typescript
interface BrowserBuildOptions {
  path: string;
  sourcemap: boolean | "inline";
  esModule: boolean;
  interop: boolean;
  min: boolean;
  format: "iife" | "amd" | "umd";
  name: string | null;
  id: string | null;
  globals: Record<string, string> | null;
  extend: boolean;
}
```

### TypesBuildOptions

```typescript
interface TypesBuildOptions {
  path: string;
  equals: boolean;
}
```

## Known Issues

* [Issue #7](https://github.com/manferlo81/bundlib/issues/7)

## Features

* Builds a `CommonJS Module` based on the `"main"` field in your `package.json`
* Builds an `ES Module` based on the `"module"` (or `"jsnext:main"`) field in your `package.json`
* Builds a `Browser` module based on the `"browser"` field in your `package.json`
* Builds an CLI `Binary` module based on the `"bin"` field in your `package.json`
* Exports type declarations based on the `"types"` or `"typings"` field in your `package.json`
* Skip any build based on options
* Sets `"dependencies"`, `"peerDependencies"` and `"optionalDependencies"` as external for `CommonJS Module`, `ES Module` and `Binary` builds
* Uses the user copy of `typescript` if installed
* Uses `chokidar` if installed
* Importing an internal file from a package `Ex: lodash/core` will be treated as external if `lodash` is included in your `"dependencies"`, `peerDependencies` or `optionalDependencies`
* Transforms `async/await` using [`babel-plugin-transform-async-to-promises`](https://github.com/rpetrich/babel-plugin-transform-async-to-promises) for ES5 support
* Dynamic Import support through [`@babel/plugin-syntax-dynamic-import`](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import)
* Transforms `Object.assign` using [`@babel/plugin-transform-object-assign`](https://babeljs.io/docs/en/babel-plugin-transform-object-assign)
* `React JSX` support through [`@babel/preset-react`](https://babeljs.io/docs/en/next/babel-preset-react)
* Uses [`@babel/preset-env`](https://babeljs.io/docs/en/next/babel-preset-env)
* Minifies build for production using [`Terser`](https://github.com/terser-js/terser)

## License

[MIT](LICENSE) &copy; [Manuel Fernández](https://github.com/manferlo81)
