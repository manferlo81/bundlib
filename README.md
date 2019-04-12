# Bundlib

A Zero-configuration, automatic javascript library bundler using [Typescript](#) and [Rollup.js](#).

> :warning: Bundlib is still under active development, if you find any issue/bug please open a new issue.

## A bit of history

I love [Rollup.js](#) and I love [Typescript](#) and I always use them for my projects, but I found myself setting up the same thing once and once again, so I needed a tool to setup the project for me, then I found [Microbundle](#), which is awesome, it inspired me but it didn't really suit my needs, that's when I decided to write [Bundlib](#).

Bundlib is meant to be used only for libraries (it does not support HTML nor CSS), it builds CommonJS and ES modules without any configuration [see Features for more info](#features), to start [see First steps](#first-steps).

## Install

* as a dev dependency

```sh
npm i bundlib -D
```

* or install it globally if you wish

```sh
npm i bundlib -g
```

## First steps
Bundlib will use `src/index.ts` as entry file for your library by default, make sure you create it before you try to build. Add the corresponding scripts to your `package.json` ([see below for CLI options](#cli)) and run them.

## CommonJS module

Building a `CommonJS Module` is as simple as creating a `"main"` field in `package.json` pointing to the output file, and `bundlib` will build it for you.

## ES module

To build a `ES Module` simply add a `"module"` field in `package.json` pointing to the output file.

## IIFE, AMD and UMD build

For IIFE, AMD and UMD builds you will need to use the `"bundlib"` field in `package.json`, see the [configuration section](#configuration) for more info.

## Configuration

Configuration is done throu the `"bundlib"` field in `package.json`.

### Example

The following example will generate a **UMD** build in `my-lib.umd.js` file inside the `dist` folder, then you can use the library in the browser (for example) using the global `myLib` (`window.myLib`).

```javascript
// package.json
{
  "version": "1.0.0",
  "name": "my-lib",
  // ...
  "bundlib": {
    "name": "myLib",
    "umd": "dist/my-lib.umd.js"
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

*the path to the input file*

#### sourcemap

* *used in:* `all builds`
* *type:* `boolean`
* *defaults to* `true`

*whether to generate source maps*

#### esModule

* *used in:* `CommonJS, IIFE, AMD & UMD bulds`
* *type:* `boolean`
* *defaults to* `false`

*whether to add a* `esModule` *property to your build.*

#### interop

* *used in:* `CommonJS, IIFE, AMD & UMD bulds`
* *type:* `boolean`
* *defaults to* `false`

#### name

* *used in:* `IIFE, AMD & UMD bulds`
* *type:* `string`
* *required for:* `IIFE, AMD & UMD builds`

*the* `IIFE`, `AMD` or `UMD` *name*

#### id

* *used in:* `AMD & UMD bulds`
* *type:* `string`

*optional amd id for* `AMD` or `UMD` *build.*
> *if not present,* `AMD` *module will be defined with no id.*

#### extend

* *used in:* `IIFE, AMD & UMD bulds`
* *type:* `boolean`
* *defaults to* `false`

*whether to extend the name on an* `IIFE`, `AMD` or `UMD` *build.*

#### globals

* *used in:* `IIFE, AMD & UMD bulds`
* *type:* `object`

*object to map names to globals*

#### iife

* *type:* `string`

*the output path for* `IIFE` *build.*
> *if not present,* `IIFE` *build will be skipped.*

#### amd

* *type:* `string`

*the output path for* `AMD` *build.*
> *if not present,* `AMD` *build will be skipped.*

#### umd

* *type:* `string`

*the output path for* `UMD` *build.*
> *if not present,* `UMD` *build will be skipped.*

## CLI

```sh
bundlib [options]
```

Bundlib has only two options

* `-d`, `--dev` : *creates a development, not minified builds.*
* `-w`, `--watch` : *runs* `bundlib` *in watch mode.*

> Combine your options according to your needs.

## Features

* [x] Creates a CommonJS Module based on the `"main"` field in `package.json`
* [x] Creates an ES Modules based on the `"module"` field in `package.json`
* [x] Exports types declarations based on the `"typings"` or `"types"` field in your `package.json`
* [x] Creates IIFE, AMD and UMD builds using the `"bundlib"` field in your `package.json`, see [configuration section](#configuration) for more info.
* [x] Transforms async/await using [Babel](#) and [babel-plugin-transform-async-to-promises](#) for ES5 support
* [x] Transforms using [Buble](#)

# License

MIT
