# Bundlib

[![CircleCI](https://circleci.com/gh/manferlo81/bundlib.svg?style=svg)](https://circleci.com/gh/manferlo81/bundlib) [![Greenkeeper badge](https://badges.greenkeeper.io/manferlo81/bundlib.svg)](https://greenkeeper.io/) [![npm](https://img.shields.io/npm/v/bundlib.svg)](https://www.npmjs.com/package/bundlib) [![dependencies Status](https://david-dm.org/manferlo81/bundlib/status.svg)](https://david-dm.org/manferlo81/bundlib) [![devDependencies Status](https://david-dm.org/manferlo81/bundlib/dev-status.svg)](https://david-dm.org/manferlo81/bundlib?type=dev) [![install size](https://packagephobia.now.sh/badge?p=bundlib)](https://packagephobia.now.sh/result?p=bundlib) [![Known Vulnerabilities](https://snyk.io/test/github/manferlo81/bundlib/badge.svg?targetFile=package.json)](https://snyk.io/test/github/manferlo81/bundlib?targetFile=package.json) [![codecov](https://codecov.io/gh/manferlo81/bundlib/branch/master/graph/badge.svg)](https://codecov.io/gh/manferlo81/bundlib) [![License](https://img.shields.io/github/license/manferlo81/bundlib.svg)](LICENSE)

A Zero-configuration, automatic javascript library bundler using [Typescript](https://github.com/Microsoft/TypeScript) and [Rollup.js](https://github.com/rollup/rollup).

> :warning: Bundlib is still under active development, please [file a new issue](https://github.com/manferlo81/bundlib/issues) if you find any issue/bug, suggestions are welcome as well.

## Install

##### as a dev dependency

```bash
npm i bundlib -D
```

##### or install it globally if you wish

```bash
npm i bundlib -g
```

## First steps

Bundlib will use `src/index.ts` as entry file for your library by default, make sure you create it before you try to build. Add the corresponding scripts to your `package.json` ([see below for CLI options](#cli)) and run them.

## Build

### CommonJS module

Building a `CommonJS Module` is as simple as adding a `"main"` field to your `package.json` pointing to the output file, and `bundlib` will build it for you. see the [configuration section](#configuration) for some extra options.

### ES module

To build a `ES Module` simply add a `"module"` field to your `package.json` pointing to the output file. see the [configuration section](#configuration) for some extra options.

### IIFE, AMD and UMD build

For IIFE, AMD and UMD builds, add a `"browser"` field to your `package.json`. the default format is `"umd"` but it can be changed to `"iife"` or `"amd"` using the `browser` option, see the [configuration section](#configuration) for more info.

## Configuration

Configuration is done throu the `"bundlib"` field in `package.json`.

##### Example

The following example will generate a **AMD** build with filename `my-lib.amd.js` inside the `dist` folder, then you can use the library in the browser (for example) using the global `myLib` (`window.myLib`).

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

the `"bundlib"` field in `package.json` may contain any of the following properties.

#### input

* *used in:* `all builds`
* *type:* `string`
* *defaults to* `"src/index.ts"`

*the path to the input file, it has to be a* `.ts` *file*

> *allowing javascript (*`.js`*) files as input is comming soon*

#### sourcemap

* *used in:* `all builds`
* *type:* `boolean`
* *defaults to* `true`

*whether or not to generate source maps*

#### esModule

* *used in:* `CommonJS, IIFE, AMD & UMD builds`
* *type:* `boolean`
* *defaults to* `false`

*whether or not to add a* `__esModule: true` *property to your non-es-module build.*

#### interop

* *used in:* `CommonJS, IIFE, AMD & UMD builds`
* *type:* `boolean`
* *defaults to* `false`

*whether or not to add an interop block*

#### browser

* *added in* `v0.3.0`
* *type:* `"iife" | "amd" | "umd"`
* *defaults to* `"umd"`

*defines the format to be used for the* `browser` *build*

#### name

* *used in:* `IIFE, AMD & UMD builds`
* *type:* `string`
* *required for:* `IIFE, AMD & UMD builds`

*the* `IIFE`, `AMD` or `UMD` *name*

*if not provided it will default to* `"name"` *field in* `package.json` *, if it doesn't exist the build process will throw*

#### id

* *used in:* `AMD & UMD builds`
* *type:* `string`

*optional amd id for* `AMD` or `UMD` *build.*

> *if not present,* `AMD` *module will be defined with no id.*

#### extend

* *used in:* `IIFE, AMD & UMD builds`
* *type:* `boolean`
* *defaults to* `false`

*whether or not to extend the global exported variable on an* `IIFE`, `AMD` or `UMD` *build.*

#### globals

* *used in:* `IIFE, AMD & UMD builds`
* *type:* `object`

*object to map names to globals*

#### equals

* *added in* `v0.1.0`
* *used in:* `types for CommonJS build`
* *type:* `boolean`
* *defaults to* `false`

*fixes type export for CommonJS module using* `export = ...` instead of `export default ...`

> :warning: note that this options should only be used when your library has a default export and no named exports.

#### min

* *added in* `v0.3.2`
* *used in:* `all builds`
* *type:* `"main" | "module" | "browser" | Array<"main" | "module" | "browser">`

*Defines which module to build an aditional minified version. The minified file will be renamed from* `*.ext` to `*.min.ext`.

> *In* `v0.4.0` *the behavior of this option slightly changed. Output modules affected by this option won't be minified, even if the* [`dev`](#-dev-d) *cli option hasn\'t been set.*

### Deprecated Options

#### iife

* *deprecated in* `v0.3.0`*, use* [browser option](#browser) *instead.*
* *type:* `string`

*the output path for* `IIFE` *build.*
> *if not present,* `IIFE` *build will be skipped.*

#### amd

* *deprecated in* `v0.3.0`*, use* [browser option](#browser) *instead.*
* *type:* `string`

*the output path for* `AMD` *build.*
> *if not present,* `AMD` *build will be skipped.*

#### umd

* *deprecated in* `v0.3.0`*, use* [browser option](#browser) *instead.*
* *type:* `string`

*the output path for* `UMD` *build.*
> *if not present,* `UMD` *build will be skipped.*


## CLI

```bash
bundlib [options]
```

### Options

*Bundlib has only three options...*

#### --dev, -d

*type:* `boolean`

*creates a development, not minified builds.*

#### --watch, -w

*type:* `boolean`

*runs* `bundlib` *in watch mode.*

#### --silent, -s

*type:* `boolean`

*prevent messages from showing in the console.*

## Known Issues

* [Issue #7](https://github.com/manferlo81/bundlib/issues/7)

## Features

### Current Features

* [x] Creates a CommonJS Module based on the `"main"` field in `package.json`
* [x] Creates an ES Modules based on the `"module"` field in `package.json`
* [x] Creates an browser build based on the `"browser"` field in `package.json`
* [x] Exports types declarations based on the `"typings"` or `"types"` field in your `package.json`
* [x] Transforms async/await using [Babel](#) and [babel-plugin-transform-async-to-promises](#) for ES5 support
* [x] Transforms using [Buble](#)
* [x] Minifies build using [terser](#)

### Upcomming Features

* [ ] Creates an CLI binary build based on the `"bin"` field in `package.json`

## License

[MIT](LICENSE) &copy; Manuel Fernández
