# Bundlib

[![CircleCI](https://circleci.com/gh/manferlo81/bundlib.svg?style=svg)](https://circleci.com/gh/manferlo81/bundlib) [![Greenkeeper badge](https://badges.greenkeeper.io/manferlo81/bundlib.svg)](https://greenkeeper.io/) [![npm](https://img.shields.io/npm/v/bundlib.svg)](https://www.npmjs.com/package/bundlib) [![dependencies Status](https://david-dm.org/manferlo81/bundlib/status.svg)](https://david-dm.org/manferlo81/bundlib) [![devDependencies Status](https://david-dm.org/manferlo81/bundlib/dev-status.svg)](https://david-dm.org/manferlo81/bundlib?type=dev) [![install size](https://packagephobia.now.sh/badge?p=bundlib)](https://packagephobia.now.sh/result?p=bundlib) [![Known Vulnerabilities](https://snyk.io/test/github/manferlo81/bundlib/badge.svg?targetFile=package.json)](https://snyk.io/test/github/manferlo81/bundlib?targetFile=package.json) [![codecov](https://codecov.io/gh/manferlo81/bundlib/branch/master/graph/badge.svg)](https://codecov.io/gh/manferlo81/bundlib) [![License](https://img.shields.io/github/license/manferlo81/bundlib.svg)](LICENSE)

An automatic javascript library bundler using [Typescript](https://github.com/Microsoft/TypeScript) and [Rollup.js](https://github.com/rollup/rollup).

> :warning: Bundlib is still under active development, please [file a new issue](https://github.com/manferlo81/bundlib/issues) if you find any issue/bug, suggestions are welcome as well.

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

*Bundlib will use* `src/index.ts` *as entry file for your library by default, it can be configured using* [`input`](#input) *option. Add the corresponding scripts to your* `package.json` *and run them. [see below for CLI options](#cli).*

## Build

### CommonJS module

*Building a* `CommonJS Module` *is as simple as adding a* `"main"` *field to your* `package.json` *pointing to the output file, and* `bundlib` *will build it for you. [see the configuration section](#configuration) for extra options.*

### ES module

*To build a* `ES Module` *simply add a* `"module"` *field to your* `package.json` *pointing to the output file. [see the configuration section](#configuration) for extra options.*

### IIFE, AMD and UMD build

*For* `IIFE`*,* `AMD` *or* `UMD` *builds, add a* `"browser"` *field to your* `package.json`*. the default format is* `"umd"` *but it can be changed to* `"iife"` *or* `"amd"` *using the* [`format`](#format) *or* [`browser`](#browser) *option, see the [configuration section](#configuration) for more info.*

## Configuration

*Configuration is done throu the* `"bundlib"` *field in* `package.json`*. See the [list of options](#options) below.*

***example***

```javascript
// package.json
{
  "version": "1.0.0",
  "name": "my-lib",
  "browser" : "dist/my-lib.amd.js",
  // ...
  "bundlib": {
    "name": "myLib",
    "browser": "amd"
  }
  // ...
}
```

### Options

*The* `"bundlib"` *field in* `package.json` *may contain any of the following properties. Any invalid or unknown option will cause* `Bundlib` *to throw at build time. Setting any options or sub-options to* `null` *will cause* `bundlib` *to treat it as non-exitent.*

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

*The path to the file(s) to be used as entry point for modules and binary. They have to be* `.ts` *files for* `bundlib` *to create* `rollup` *options. If a string provided, it will be used as api entry point and binary entry point will be set to default value.*

#### sourcemap

* `"inline"` *support added in:* `v0.6.0`

```typescript
sourcemap: boolean | "inline";

default true;
```

*Whether or not to generate source maps. Anything other than* `false` *or* `"inline"` *will default to* `true`*.*

*This option can be overridden using* `per-build` *options. See* [`main`](#main)*,* [`module`](#module)*,* [`browser`](#browser) *&* [`bin`](#bin) *options.*

#### esModule

```typescript
esModule: BuildType | BuildType[] | boolean;

type BuildType = "main" | "browser" | "min";

default false;
```

*Whether or not to add a* `__esModule: true` *property to your non-es-module build. If* `esModule = true` *it will affect all builds.*

*This option can be overridden using* `per-build` *options. See* [`main`](#main)*,* [`browser`](#browser) *&* [`bin`](#bin) *options.*

#### interop

```typescript
interop: BuildType | BuildType[] | boolean;

type BuildType = "main" | "browser" | "min";

default false;
```

*Whether or not to add an interop block. If* `interop = true` *it will affect all builds.*

*This option can be overridden using* `per-build` *options. See* [`main`](#main)*,* [`browser`](#browser) *&* [`bin`](#bin) *options.*

#### format

* *added in:* `v0.7.0`

```typescript
format: "iife" | "amd" | "umd";

default "umd";
```

*Defines the format to be used for the* `browser` *build.*

*This option can be also defined using* `per-build` *options. See* [`browser`](#browser) *option.*

#### name

```typescript
name: string;
```

*The name to be used to expose your library to the global scope in a* `IIFE` or `UMD` *browser build. If not provided it will default to the camelcased, unscoped* `"name"` *field in* `package.json` *or the camelcased directory name. If none of those can be obtained, it will throw at build time.*

*This option can be also defined using* `per-build` *options. See* [`browser`](#browser) *option.*

#### id

```typescript
id: string;
```

*Optional amd id for* `AMD` *or* `UMD` *build.*

*This option can be also defined using* `per-build` *options. See* [`browser`](#browser) *option.*

*If not present,* `AMD` *module will be defined with no id.*

#### extend

```typescript
extend: boolean;

default false;
```

*Whether or not to extend the globally exposed name on a* `IIFE`, `UMD` *build.*

*This option can be also defined using* `per-build` *options. See* [`browser`](#browser) *option.*

#### globals

```typescript
globals: { [name: string]: string } | string[];
```

*Object or array to map names to globals in browser builds.*

*This option can be also defined using* `per-build` *options. See* [`browser`](#browser) *option.*

#### equals

* *added in:* `v0.1.0`

```typescript
equals: boolean;

default false;
```

*Transforms type export for CommonJS module using* `export = ...` *instead of* `export default ...`*.*

*This option can be also defined using* `per-build` *options. See* [`types`](#types) *option.*

> :warning: *Note that this options should only be used when your library has a default export and no named exports, otherwise it may cause the types to become invalid.*

#### min

* *added in:* `v0.3.2`
* `boolean` *support added in:* `v0.4.1`

```typescript
min: BuildType | BuildType[] | boolean;

type BuildType = "main" | "module" | "browser" | "min";

default false;
```

*Defines which files should be used to build an aditional minified version, if* `true` *will affect all modules. The minified file will be renamed from* `*.ext` to `*.min.ext`*. This option will override the default behavior of the* [`--dev`, `-d` *cli option*](#-dev-d) *, which means only the minified version will be actually minified, the normal version will **NOT** be minified even if you don't set the* [`--dev`, `-d` *cli option*](#-dev-d)*.*

*This option can be overridden using* `per-build` *options. See* [`main`](#main)*,* [`module`](#module)*,* [`browser`](#browser) *&* [`bin`](#bin) *options.*

#### cache

* *added in:* `v0.6.0`

```typescript
cache: string;

default "node_modules/.cache/bundlib"
```

*Defines the directory to be used for cache, relative to the project root.*

#### main

* *added in:* `v0.10.0`

```typescript
main: CommonJSOptions | false;

interface CommonJSOptions {
  sourcemap?: boolean | "inline";
  esModule?: boolean | null;
  interop?: boolean | null;
  min?: boolean | null;
}
```

*Specific options to be used in* `CommonJS` *build. They will override any corresponding option set in the top-level options. See* [`sourcemap`](#sourcemap)*,* [`esModule`](#esmodule)*,* [`interop`](#interop) *&* [`min`](#min) *options.*

*If it's set to* `false`*, it will prevent* `CommonJS` *build altogether, even if there is a* `main` *field in* `package.json`*.*

#### module

* *added in:* `v0.10.0`

```typescript
module: ESModuleOptions | false;

interface ESModuleOptions {
  sourcemap?: boolean | "inline";
  min?: boolean;
}
```

*Specific options to be used in* `ESModule` *build. They will override any corresponding option set in the top-level options. See* [`sourcemap`](#sourcemap) *&* [`min`](#min) *options.*

*If it's set to* `false`*, it will prevent* `ESModule` *build altogether, even if there is a* `module` *or* `jsnext:main` *field in* `package.json`*.*

#### browser

* *added in:* `v0.10.0`

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

*Specific options to be used in* `Browser` *build. They will override any corresponding option set in the top-level options. See* [`sourcemap`](#sourcemap)*,* [`esModule`](#esmodule)*,* [`interop`](#interop)*,* [`min`](#min)*,* [`format`](#format)*,* [`name`](#name)*,* [`id`](#id)*,* [`extend`](#extend) *&* [`globals`](#globals) *options.*

*If it's set to* `false`*, it will prevent* `Browser` *build altogether, even if there is a* `browser` *field in* `package.json`*.*

#### bin

* *added in:* `v0.7.0`
* `per-build` *behavior added in:* `v0.10.0`

```typescript
bin: CommonJSOptions | false;

interface CommonJSOptions {
  sourcemap?: boolean | "inline";
  esModule?: boolean;
  interop?: boolean;
  min?: boolean;
}
```

*Specific options to be used in* `Binary` *build. They will override any corresponding option set in the top-level options. See* [`sourcemap`](#sourcemap)*,* [`esModule`](#esmodule)*,* [`interop`](#interop) *&* [`min`](#min) *options.*

*If it's set to* `false`*, it will prevent* `Binary` *build altogether, even if there is a* `bin` *field in* `package.json`*.*

> :warning: *This option was used to set entry point for* `Binary` *build. For compatibility it still works if you set this option as string. This behavior will be removed in the future and therefore should not be used. Use* [`input`](#input) *option instead.*

#### types

* *added in:* `v0.10.0`

```typescript
types: TypesOptions | false;

interface TypesOptions {
  equals: boolean;
}
```

*Specific options to be used for types generation. They will override any corresponding option set in the top-level options. See* [`equals`](#equals) *option.*

*If it's set to* `false`*, it will prevent type declarations generation altogether, even if there is a* `types` *or* `typings` *field in* `package.json`*.*

## CLI

```bash
bundlib [options]
```

### CLI Options

*Combine options according to your needs. Run* `bundlib -h` *for a detailed help.*

#### `--dev`, `-d`

*Create development, not minified builds. Builds affected by the* [`min`](#min) *option will ignore this option.*

#### `--watch`, `-w`

*Run* `bundlib` *in watch mode.*

#### `--silent`, `-s`

*Prevent messages from showing in the console.*

#### `--version`, `-v`

*Show* `bundlib` *version.*

#### `--help`, `-h`

*Show detailed help about the cli tool.*

## API

***example***

```javascript
// rollup.config.js

import { configsFromPkg } from "bundlib";

const dev = !process.env.production;

export default () => configsFromPkg(
  process.cwd(),
  dev,
);
```

### analizePkg

```typescript
function analizePkg(
  cwd: string,
  pkg: PkgJson = read(cwd + "/package.json"),
): Promise<PkgAnalized>;
```

*Analizes* `package.json` *and returns a* `Promise` *that resolves to useful normalized information,* [*see* `PkgAnalized`](#pkganalized)*. If* `pkg` *not provided it will be read from the current working directory* `cwd`*.*

> :warning: *The return of this function changed drastically from* `v0.9.x` *to* `v0.10.x`*. This only affects you if you are using this method, if you are using* `configsFromPkg` *or the cli, you are safe to update.*

### configsFromPkg

```typescript
function configsFromPkg(
  cwd: string,
  dev: boolean = false,
  pkg: PkgJson = read(cwd + "/package.json"),
): Promise<RollupOptions[]>;
```

*Returns a* `Promise` *that resolves to an array of Rollup configs based on the content of* `package.json`*. If* `pkg` *not provided it will be read from the current working directory* `cwd`*.*

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
    runtime: string[] | null;
    peer: string[] | null;
    optional: string[] | null;
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

* [x] *Creates a* `CommonJS` *Module based on the* `"main"` *field in* `package.json`
* [x] *Creates an* `ES Module` *based on the* `"module"` *field in* `package.json`
* [x] *Creates an* `Browser` *build based on the* `"browser"` *field in* `package.json` *(only if* `"browser"` *fields is a* `string`*)*
* [x] *Creates an CLI* `Binary` *build based on the* `"bin"` *field in* `package.json` *(only if* `"bin"` *fields is a* `string`*)*
* [x] *Exports types declarations based on the* `"types"` *or* `"typings"` *field in your* `package.json`
* [x] *Skip any build based on options*
* [x] *Sets* `dependencies`*,* `peerDependencies` *and `optionalDependencies` *as external for* `CommonJS`*,* `ES Module` *and* `Bynary` *modules*
* [x] *Uses the user copy of* `typescript` *if installed*
* [x] *Importing an internal file from a package* `Ex: lodash/core` *will be treated as external if* `lodash` *is included in your* `dependencies` *or* `peerDependencies`
* [x] *Transforms* `async/await` *using* [`Babel`](https://github.com/babel/babel) *and* [`babel-plugin-transform-async-to-promises`](https://github.com/rpetrich/babel-plugin-transform-async-to-promises) *for ES5 support*
* [x] *Dynamic Import support through* [`@babel/plugin-syntax-dynamic-import`](#https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import)
* [x] *Transforms using* [`Buble`](https://github.com/bublejs/buble)
* [x] *Minifies build using* [`Terser`](https://github.com/terser-js/terser)

## License

[MIT](LICENSE) &copy; [Manuel Fernández](https://github.com/manferlo81)
