# Bundlib Changelog

## Changes

### [0.13.0](https://github.com/manferlo81/bundlib/compare/v0.12.6...v0.13.0) (2019-10-21)

* dependencies updated
* removed `"bin"` option as `string` support
* minor refactoring

### [0.12.6](https://github.com/manferlo81/bundlib/compare/v0.12.5...v0.12.6) (2019-09-23)

* dependencies updated
* switched from `chalk` to `colorette`

### [0.12.5](https://github.com/manferlo81/bundlib/compare/v0.12.4...v0.12.5) (2019-09-10)

* dependencies updated
* improved documentation
* use `displayName` from `package.json`

### [0.12.4](https://github.com/manferlo81/bundlib/compare/v0.12.3...v0.12.4) (2019-09-05)

* using `async-to-promises` inline helpers

### [0.12.3](https://github.com/manferlo81/bundlib/compare/v0.12.2...v0.12.3) (2019-09-04)

* dependencies updated
* console messages refactoring
* windows detection based on `process.platform`
* formatted rollup warnings
* refactoring

### [0.12.2](https://github.com/manferlo81/bundlib/compare/v0.12.1...v0.12.2) (2019-08-28)

* dependencies updated
* use `@babel/plugin-transform-object-assign`

### [0.12.1](https://github.com/manferlo81/bundlib/compare/v0.12.0...v0.12.1) (2019-08-10)

* fixed typo in documentation
* dependencies updated
* babel `loose` transformations

### [0.12.0](https://github.com/manferlo81/bundlib/compare/v0.11.2...v0.12.0) (2019-07-25)

* `React JSX` support
* javascript input support
* dependencies updated
* improved documentation

### [0.11.2](https://github.com/manferlo81/bundlib/compare/v0.11.1...v0.11.2) (2019-07-14)

* fixed: add default shebang for binary if none specified

### [0.11.1](https://github.com/manferlo81/bundlib/compare/v0.11.0...v0.11.1) (2019-07-14)

* bug fixes

### [0.11.0](https://github.com/manferlo81/bundlib/compare/v0.10.1...v0.11.0) (2019-07-13)

* added selective support to top-level `esModule` & `interop` options
* don't check `package.json` field if corresponding build disabled
* dynamic imports support
* imports user `typescript` if installed
* use `chokidar` only if installed
* changes in `configsFromPkg` api method
* colors on git bach for windows
* improved documentation
* dependencies updated

### [0.10.1](https://github.com/manferlo81/bundlib/compare/v0.10.0...v0.10.1) (2019-07-11)

* fixed: binary min version

### [0.10.0](https://github.com/manferlo81/bundlib/compare/v0.9.0...v0.10.0) (2019-07-11)

* dependencies updated
* added `main` option
* added `module` option
* added `types` option
* re-added `browser` option with different functionality
* `input` option additional functionalities
* `bin` option additional functionalities
* `bin` option old functionality deprecated
* `analizePkg` returns a totally different object

### [0.9.0](https://github.com/manferlo81/bundlib/compare/v0.8.5...v0.9.0) (2019-07-09)

* reformat project name & version message
* dependencies updated
* removed `browser` option

### [0.8.5](https://github.com/manferlo81/bundlib/compare/v0.8.4...v0.8.5) (2019-07-08)

* print project name & version

### [0.8.4](https://github.com/manferlo81/bundlib/compare/v0.8.3...v0.8.4) (2019-07-07)

* fixed: issue with globals when building for browser
* fixed: issue with cache

### [0.8.3](https://github.com/manferlo81/bundlib/compare/v0.8.2...v0.8.3) (2019-07-07)

* refactoring
* build with cache
* dependencies updated

### [0.8.2](https://github.com/manferlo81/bundlib/compare/v0.8.1...v0.8.2) (2019-07-06)

* code cleanup
* removed `snyk` patch for `lodash`
* better validation & type check for `package.json` fields
* better validation & type check for options

### [0.8.1](https://github.com/manferlo81/bundlib/compare/v0.8.0...v0.8.1) (2019-07-05)

* applied `snyk` patch for `lodash`

### [0.8.0](https://github.com/manferlo81/bundlib/compare/v0.7.3...v0.8.0) (2019-07-05)

* `configsFromPkg` throws on non `*.ts` input instead of `analizePkg`
* `optionalDependencies` as external
* `jsnext:main` field as `module` field fallback
* analized dependencies as null if not present
* dependencies updated

### [0.7.3](https://github.com/manferlo81/bundlib/compare/v0.7.2...v0.7.3) (2019-06-30)

* external as function with cache
* import package file as external

### [0.7.2](https://github.com/manferlo81/bundlib/compare/v0.7.1...v0.7.2) (2019-06-30)

* dependencies updated
* fixed: wrong name on `bin` option error
* better types for config functions
* `ts-jest` for typescript test
* added `husky`

### [0.7.1](https://github.com/manferlo81/bundlib/compare/v0.7.0...v0.7.1) (2019-06-27)

* fixed cache folder
* dependencies updated

### [0.7.0](https://github.com/manferlo81/bundlib/compare/v0.6.0...v0.7.0) (2019-06-27)

* added support for CLI binary file
* added `bin` option
* added `format` option
* deprecated `browser` option
* `name` option default behavior
* documentation improved
* better errors

### [0.6.0](https://github.com/manferlo81/bundlib/compare/v0.5.4...v0.6.0) (2019-06-25)

* full api & cli makeover
* removed deprecated options
* `"inline"` sourcemap support
* added option validation
* added `cache` option
* improved documentation
* dependencies updated

### [0.5.4](https://github.com/manferlo81/bundlib/compare/v0.5.3...v0.5.4) (2019-06-23)

* dependencies updated

### [0.5.3](https://github.com/manferlo81/bundlib/compare/v0.5.2...v0.5.3) (2019-06-22)

* dependencies updated

### [0.5.2](https://github.com/manferlo81/bundlib/compare/v0.5.1...v0.5.2) (2019-06-22)

* dependencies updated

### [0.5.1](https://github.com/manferlo81/bundlib/compare/v0.5.0...v0.5.1) (2019-06-07)

* removed version print

### [0.5.0](https://github.com/manferlo81/bundlib/compare/v0.4.1...v0.5.0) (2019-06-06)

* dependencies updated
* refactoring

### [0.4.1](https://github.com/manferlo81/bundlib/compare/v0.4.0...v0.4.1) (2019-06-01)

* `min` option as boolean
* improved documentation
* refactoring

### [0.4.0](https://github.com/manferlo81/bundlib/compare/v0.3.2...v0.4.0) (2019-05-31)

* `min` option behavior changed
* documented changes in `min` option behavior
* refactoring
* dependencies updated

### [0.3.2](https://github.com/manferlo81/bundlib/compare/v0.3.1...v0.3.2) (2019-05-30)

* added `--silent` cli option
* added `min` option
* improved documentation
* dependencies updated

### [0.3.1](https://github.com/manferlo81/bundlib/compare/v0.3.0...v0.3.1) (2019-05-25)

* fixed types export issue related to #7
* improved documentation
* refactoring

### [0.3.0](https://github.com/manferlo81/bundlib/compare/v0.2.6...v0.3.0) (2019-05-24)

* build cli tool from source code
* deprecated `iife`, `amd` & `umd` options
* added `browser` option
* build browser build base on `browser` field
* improved documentation
* refactoring

### [0.2.6](https://github.com/manferlo81/bundlib/compare/v0.2.5...v0.2.6) (2019-05-22)

### [0.2.5](https://github.com/manferlo81/bundlib/compare/v0.2.4...v0.2.5) (2019-05-17)

* dependencies updated
* documentation improved
* added `silent` cli option
* added tests
* using `rollup-plugin-typescript2`
* code cleanup

### [0.2.4](https://github.com/manferlo81/bundlib/compare/v0.2.3...v0.2.4) (2019-04-30)

* added coverage badge
* documentation improved

### [0.2.3](https://github.com/manferlo81/bundlib/compare/v0.2.2...v0.2.3) (2019-04-30)

* using `read-pkg`
* using `builtin-modules`
* dependencies updated
* event driven build
* added new tests
* upload coverage

### [0.2.2](https://github.com/manferlo81/bundlib/compare/v0.2.1...v0.2.2) (2019-04-25)

* dependencies updated
* types refactoring

### [0.2.1](https://github.com/manferlo81/bundlib/compare/v0.2.0...v0.2.1) (2019-04-25)

* dependencies updated

### [0.2.0](https://github.com/manferlo81/bundlib/compare/v0.1.0...v0.2.0) (2019-04-25)

* analized package format refactoring

### [0.1.0](https://github.com/manferlo81/bundlib/compare/v0.0.4...v0.1.0) (2019-04-23)

* using ora
* refactoring
* dependencies updated
* added `equals` option

### [0.0.4](https://github.com/manferlo81/bundlib/compare/v0.0.3...v0.0.4) (2019-04-15)

* added greenkeeper
* documentation improved

### [0.0.3](https://github.com/manferlo81/bundlib/compare/v0.0.2...v0.0.3) (2019-04-15)

* documentation improved
* added tests
* setup circleci
* code linting

### [0.0.2](https://github.com/manferlo81/bundlib/compare/v0.0.1...v0.0.2) (2019-04-13)

* documentation improved

## 0.0.1

* Preliminary release
