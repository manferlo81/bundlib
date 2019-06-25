# Bundlib

[![CircleCI](https://circleci.com/gh/manferlo81/bundlib.svg?style=svg)](https://circleci.com/gh/manferlo81/bundlib) [![Greenkeeper badge](https://badges.greenkeeper.io/manferlo81/bundlib.svg)](https://greenkeeper.io/) [![npm](https://img.shields.io/npm/v/bundlib.svg)](https://www.npmjs.com/package/bundlib) [![dependencies Status](https://david-dm.org/manferlo81/bundlib/status.svg)](https://david-dm.org/manferlo81/bundlib) [![devDependencies Status](https://david-dm.org/manferlo81/bundlib/dev-status.svg)](https://david-dm.org/manferlo81/bundlib?type=dev) [![install size](https://packagephobia.now.sh/badge?p=bundlib)](https://packagephobia.now.sh/result?p=bundlib) [![Known Vulnerabilities](https://snyk.io/test/github/manferlo81/bundlib/badge.svg?targetFile=package.json)](https://snyk.io/test/github/manferlo81/bundlib?targetFile=package.json) [![codecov](https://codecov.io/gh/manferlo81/bundlib/branch/master/graph/badge.svg)](https://codecov.io/gh/manferlo81/bundlib) [![License](https://img.shields.io/github/license/manferlo81/bundlib.svg)](LICENSE)

A Zero-configuration, automatic javascript library bundler using [Typescript](https://github.com/Microsoft/TypeScript) and [Rollup.js](https://github.com/rollup/rollup).

> :warning: Bundlib is still under active development, please [file a new issue](https://github.com/manferlo81/bundlib/issues) if you find any issue/bug, suggestions are welcome as well.

## Install

```bash
npm i bundlib -D
```

## First steps

*Bundlib will use* `src/index.ts` *as entry file for your library by default, it can be configured using [input option](#input). Add the corresponding scripts to your* `package.json` *and run them. [see below for CLI options](#cli).*

## Build

### CommonJS module

*Building a* `CommonJS Module` *is as simple as adding a* `"main"` *field to your* `package.json` *pointing to the output file, and* `bundlib` *will build it for you. [see the configuration section](#configuration) for extra options.*

### ES module

*To build a* `ES Module` *simply add a* `"module"` *field to your* `package.json` *pointing to the output file. [see the configuration section](#configuration) for extra options.*

### IIFE, AMD and UMD build

*For IIFE, AMD and UMD builds, add a* `"browser"` *field to your* `package.json`*. the default format is* `"umd"` *but it can be changed to* `"iife"` *or* `"amd"` *using the* [`browser` *option*](#browser)*, see the [configuration section](#configuration) for more info.*

## Configuration

*Configuration is done throu the* `"bundlib"` *field in* `package.json`*.*

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

*The* `"bundlib"` *field in* `package.json` *may contain any of the following properties. Any invalid or unknown option will cause* `Bundlib` *to throw at build time.*

#### input

* *used in:* `all builds`
* *type:* `string`
* *defaults to* `"src/index.ts"`

*The path to the file to be used as entry point. It has to be a* `.ts` *file.*

#### sourcemap

* `"inline"` *support added in* `v0.6.0`
* *used in:* `all builds`
* *type:* `boolean` | `"inline"`
* *defaults to* `true`

*Whether or not to generate source maps. Anything other than* `false` *or* `"inline"` *will default to* `true`*.*

#### esModule

* *used in:* `CommonJS, IIFE, AMD & UMD builds`
* *type:* `boolean`
* *defaults to* `false`

*Whether or not to add a* `__esModule: true` *property to your non-es-module build.*

#### interop

* *used in:* `CommonJS, IIFE, AMD & UMD builds`
* *type:* `boolean`
* *defaults to* `false`

*Whether or not to add an interop block.*

#### browser

* *added in* `v0.3.0`
* *type:* `"iife"` | `"amd"` | `"umd"`
* *defaults to* `"umd"`

*Defines the format to be used for the* `browser` *build.*

#### name

* *used in:* `IIFE & UMD builds`
* *type:* `string`
* *required for:* `IIFE & UMD builds`

*The name to be used to expose your library to the global scope in a* `IIFE` or `UMD` *build.*

*If not provided it will default to* `"name"` *field in* `package.json` *. If this last one doesn't exist the build process will throw.*

#### id

* *used in:* `AMD & UMD builds`
* *type:* `string`

*Optional amd id for* `AMD` or `UMD` *builds.*

> *If not present,* `AMD` *module will be defined with no id.*

#### extend

* *used in:* `IIFE, AMD & UMD builds`
* *type:* `boolean`
* *defaults to* `false`

*Whether or not to extend the globally exposed name on a* `IIFE`, `AMD` or `UMD` *build.*

#### globals

* *used in:* `IIFE, AMD & UMD builds`
* *type:* `{ [name: string]: string }` | `string[]`

*Object or array to map names to globals.*

#### equals

* *added in* `v0.1.0`
* *used in:* `types for CommonJS build`
* *type:* `boolean`
* *defaults to* `false`

*Fixes type export for CommonJS module using* `export = ...` *instead of* `export default ...`

> :warning: *Note that this options should only be used when your library has a default export and no named exports.*

#### min

* *added in* `v0.3.2`
* `boolean` *support added in* `v0.4.1`
* *used in:* `all builds`
* *type:* `"main" | "module" | "browser" | boolean | Array<"main" | "module" | "browser">`

*Defines which files should be used to build an aditional minified version, if* `true` *will affect all modules. The minified file will be renamed from* `*.ext` to `*.min.ext`*. This option will override the default behavior of the* [`--dev`, `-d` *cli option*](#-dev-d) *, which means only the minified version will be actually minified, the normal version will **NOT** be minified even if you don't set the* [`--dev`, `-d` *cli option*](#-dev-d)*.*

#### cache

* *added in* `v0.6.0`
* *used in:* `all builds`
* *type:* `string`
* *defaults to* `".cache"`

*Defines the directory to be used for cache, relative to the project root.*

## CLI

```bash
bundlib [options]
```

### Options

*Bundlib has only three options...*

#### `--dev`, `-d`

*type:* `boolean`

*creates development, not minified builds. Builds affected by the* [`min` *api option*](#min) *will ignore this option.*

#### `--watch`, `-w`

*type:* `boolean`

*Runs* `bundlib` *in watch mode.*

#### `--silent`, `-s`

*type:* `boolean`

*Prevent messages from showing in the console.*

## API

***example***

```javascript
// rollup.config.js

import { analizePkg, pkgToConfigs } from "bundlib";

const dev = !process.env.production;

export default async () => pkgToConfigs(
  await analizePkg(process.cwd()),
  dev,
);
```

### analizePkg

```typescript
analizePkg(cwd: string, pkg?: PkgJson): Promise<AnalizedPkg>;

interface AnalizedPkg {
    cwd: string;
    pkg: PkgJson;
    dependencies: {
      runtime: string[],
      peer: string[],
    };
    input: string;
    output: {
      main: string | null;
      module: string | null;
      browser: string | null;
      types: string | null;
    };
    sourcemap: boolean | "inline";
    browser: {
      format: "umd" | "iife" | "amd";
      name: string | null;
      id: string | null;
      globals: Record<string, string> | null;
    };
    minify: {
      main: boolean;
      module: boolean;
      browser: boolean;
    };
    options: {
      extend: boolean;
      esModule: boolean;
      interop: boolean;
      equals: boolean;
    };
    cache: string;
}
```

*Analizes* `package.json` *and return useful normalized information. If* `pkg` *not provided it will be read from the current working directory* `cwd`*.*

### pkgToConfigs

```typescript
pkgToConfigs(pkg: AnalizedPkg, dev?: boolean): RollupOptions[];
```

*Returns an array of Rollup configs from the* [`pkg: AnalizedPkg`](#analizepkg) *provided. This method does not checks for* `pkg` *integrity nor format, as it is intended to be used with the object resulting from* [`analizePkg`](#analizepkg)*.*

### createOutput

```typescript
createOutput(
  format: "cjs" | "es" | "umd" | "iife" | "amd",
  outputFile: string,
  sourcemap: boolean | "inline",
  esModule: boolean,
  interop: boolean,
  extra?: OutputExtra,
): RollupOutputOptions;
```

*Creates Rollup output options. This method was intended for internal purposes but was exposed as it may be useful.*

### createConfig

```typescript
createConfig(
  inputFile: string,
  outputOptions: RollupOutputOptions,
  external: RollupExternalOption,
  plugins: Array<RollupPlugin | null | false>,
  extra?: ConfigExtra,
): RollupOptions;
```

*Creates Rollup config object. This method was intended for internal purposes but was exposed as it may be useful.*

### createModuleConfig

```typescript
createModuleConfig(
  inputFile: string,
  format: "cjs" | "es",
  outputFile: string,
  sourcemap: boolean | "inline",
  esModule: boolean,
  interop: boolean,
  external: ExternalOption,
  plugins: Array<Plugin | null | false>,
): RollupOptions;
```

*Creates CommonJS or ESModule Rollup config object. This method was intended for internal purposes but was exposed as it may be useful.*

### createBrowserConfig

```typescript
createBrowserConfig(
  inputFile: string,
  format: "umd" | "iife" | "amd",
  outputFile: string,
  sourcemap: boolean | "inline",
  esModule: boolean,
  interop: boolean,
  plugins: Array<Plugin | null | false>,
  name: string,
  extend: boolean,
  globals?: Record<string, string> | null,
  id?: string | null,
): RollupOptions;
```

*Creates browser Rollup config object. This method was intended for internal purposes but was exposed as it may be useful.*

## Known Issues

* [Issue #7](https://github.com/manferlo81/bundlib/issues/7)

## Features

### Current Features

* [x] *Creates a CommonJS Module based on the* `"main"` *field in* `package.json`
* [x] *Creates an ES Modules based on the* `"module"` *field in* `package.json`
* [x] *Creates an browser build based on the* `"browser"` *field in* `package.json`
* [x] *Exports types declarations based on the* `"types"` *or* `"typings"` *field in your* `package.json`
* [x] *Transforms async/await using [Babel](https://github.com/babel/babel) and [babel-plugin-transform-async-to-promises](https://github.com/rpetrich/babel-plugin-transform-async-to-promises) for ES5 support*
* [x] *Transforms using [Buble](https://github.com/bublejs/buble)*
* [x] *Minifies build using [Terser](https://github.com/terser-js/terser)*

### Upcomming Features

* [ ] *Creates an CLI binary build based on the* `"bin"` *field in* `package.json`

## License

[MIT](LICENSE) &copy; [Manuel Fernández](https://github.com/manferlo81)
