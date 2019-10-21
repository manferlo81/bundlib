# Bundlib Changelog

## 0.12.7

***21-OCT-2019***

* dependencies updated
* removed `"bin"` option as `string` support

## 0.12.6

***23-SEP-2019***

* dependencies updated
* switched from `chalk` to `colorette`

## 0.12.5

***10-SEP-2019***

* dependencies updated
* improved documentation
* use `displayName` from `package.json`

## 0.12.4

***05-SEP-2019***

* using `async-to-promises` inline helpers

## 0.12.3

***04-SEP-2019***

* dependencies updated
* console messages refactoring
* windows detection based on `process.platform`
* formatted rollup warnings
* refactoring

## 0.12.2

***28-AUG-2019***

* dependencies updated
* use `@babel/plugin-transform-object-assign`

## 0.12.1

***10-AUG-2019***

* fixed typo in documentation
* dependencies updated
* babel `loose` transformations

## 0.12.0

***25-JUL-2019***

* `React JSX` support
* javascript input support
* dependencies updated
* improved documentation

## 0.11.2

***14-JUL-2019***

* fixed: add default shebang for binary if none specified

## 0.11.1

***14-JUL-2019***

* bug fixes

## 0.11.0

***13-JUL-2019***

* added selective support to top-level `esModule` & `interop` options
* don't check `package.json` field if corresponding build disabled
* dynamic imports support
* imports user `typescript` if installed
* use `chokidar` only if installed
* changes in `configsFromPkg` api method
* colors on git bach for windows
* improved documentation
* dependencies updated

## 0.10.1

***11-JUL-2019***

* fixed: binary min version

## 0.10.0

***11-JUL-2019***

* dependencies updated
* added `main` option
* added `module` option
* added `types` option
* re-added `browser` option with different functionality
* `input` option additional functionalities
* `bin` option additional functionalities
* `bin` option old functionality deprecated
* `analizePkg` returns a totally different object

## 0.9.0

***09-JUL-2019***

* reformat project name & version message
* dependencies updated
* removed `browser` option

## 0.8.5

***08-JUL-2019***

* print project name & version

## 0.8.4

***07-JUL-2019***

* fixed: issue with globals when building for browser
* fixed: issue with cache

## 0.8.3

***07-JUL-2019***

* refactoring
* build with cache
* dependencies updated

## 0.8.2

***06-JUL-2019***

* code cleanup
* removed `snyk` patch for `lodash`
* better validation & type check for `package.json` fields
* better validation & type check for options

## 0.8.1

***05-JUL-2019***

* applied `snyk` patch for `lodash`

## 0.8.0

***05-JUL-2019***

* `configsFromPkg` throws on non `*.ts` input instead of `analizePkg`
* `optionalDependencies` as external
* `jsnext:main` field as `module` field fallback
* analized dependencies as null if not present
* dependencies updated

## 0.7.3

***30-JUN-2019***

* external as function with cache
* import package file as external

## 0.7.2

***30-JUN-2019***

* dependencies updated
* fixed: wrong name on `bin` option error
* better types for config functions
* `ts-jest` for typescript test
* added `husky`

## 0.7.1

***27-JUN-2019***

* fixed cache folder
* dependencies updated

## 0.7.0

***27-JUN-2019***

* added support for CLI binary file
* added `bin` option
* added `format` option
* deprecated `browser` option
* `name` option default behavior
* documentation improved
* better errors

## 0.6.0

***25-JUN-2019***

* full api & cli makeover
* removed deprecated options
* `"inline"` sourcemap support
* added option validation
* added `cache` option
* improved documentation
* dependencies updated

## 0.5.4

***23-JUN-2019***

* dependencies updated

## 0.5.3

***22-JUN-2019***

* dependencies updated

## 0.5.2

***22-JUN-2019***

* dependencies updated

## 0.5.1

***07-JUN-2019***

* removed version print

## 0.5.0

***06-JUN-2019***

* dependencies updated
* refactoring

## 0.4.1

***01-JUN-2019***

* `min` option as boolean
* improved documentation
* refactoring

## 0.4.0

***31-MAY-2019***

* `min` option behavior changed
* documented changes in `min` option behavior
* refactoring
* dependencies updated

## 0.3.2

***30-MAY-2019***

* added `--silent` cli option
* added `min` option
* improved documentation
* dependencies updated

## 0.3.1

***25-MAY-2019***

* fixed types export issue related to #7
* improved documentation
* refactoring

## 0.3.0

***24-MAY-2019***

* build cli tool from source code
* deprecated `iife`, `amd` & `umd` options
* added `browser` option
* build browser build base on `browser` field
* improved documentation
* refactoring

## 0.2.6

***22-MAY-2019***

## 0.2.5

***17-MAY-2019***

* dependencies updated
* documentation improved
* added `silent` cli option
* added tests
* using `rollup-plugin-typescript2`
* code cleanup

## 0.2.4

***30-APR-2019***

* added coverage badge
* documentation improved

## 0.2.3

***30-APR-2019***

* using `read-pkg`
* using `builtin-modules`
* dependencies updated
* event driven build
* added new tests
* upload coverage

## 0.2.2

***25-APR-2019***

* dependencies updated
* types refactoring

## 0.2.1

***25-APR-2019***

* dependencies updated

## 0.2.0

***25-APR-2019***

* analized package format refactoring

## 0.1.0

***23-APR-2019***

* using ora
* refactoring
* dependencies updated
* added `equals` option

## 0.0.4

***15-APR-2019***

* added greenkeeper
* documentation improved

## 0.0.3

***15-APR-2019***

* documentation improved
* added tests
* setup circleci
* code linting

## 0.0.2

***13-APR-2019***

* documentation improved

## 0.0.1

* Preliminary release
