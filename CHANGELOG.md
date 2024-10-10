# Bundlib Changelog

## Version History

### [0.21.4](https://github.com/manferlo81/bundlib/compare/v0.21.3...v0.21.4) (2024-10-10)


### Bug Fixes

* Fix issue with browser build after upgrading `@rollup/plugin-commonjs` ([ee617e4](https://github.com/manferlo81/bundlib/commit/ee617e4a39be503abfd20a10a45b10c3cb2f4b05))

### [0.21.3](https://github.com/manferlo81/bundlib/compare/v0.21.2...v0.21.3) (2024-09-30)

### [0.21.2](https://github.com/manferlo81/bundlib/compare/v0.21.1...v0.21.2) (2024-09-30)


### Features

* Warn instead of throwing on unsupported NodeJS version ([bbd6804](https://github.com/manferlo81/bundlib/commit/bbd6804a3bdc6f5ae0a7f587f6799c476d3235f3))

### [0.21.1](https://github.com/manferlo81/bundlib/compare/v0.21.0...v0.21.1) (2024-09-10)


### Features

* Override typescript module type ([1f5ecfa](https://github.com/manferlo81/bundlib/commit/1f5ecfab85493bd498bfb39aabef41dba6182ed4))

## [0.21.0](https://github.com/manferlo81/bundlib/compare/v0.20.0...v0.21.0) (2024-08-23)

### ⚠ BREAKING CHANGES

* **types:** type `SelectiveSkipBuildType` is deprecated in favor of `SelectiveSkipKey`
* **types:** type `BuildTypeForAPI` is deprecated
* **type:** Deprecate wrongly spelled type `GlobalsOptions` in favor of `GlobalsOption`

### Features

* Add `config` helper function ([68a841a](https://github.com/manferlo81/bundlib/commit/68a841a24195a99dc892124cd4452fd69477752b))

* **type:** Deprecate wrongly spelled type `GlobalsOptions` in favor of `GlobalsOption` ([2ea3f85](https://github.com/manferlo81/bundlib/commit/2ea3f85360d442992e8438db88b2bddb18a927bb))
* **types:** type `BuildTypeForAPI` is deprecated ([d075719](https://github.com/manferlo81/bundlib/commit/d075719e917081ddc10bd99c103a3a51226192f0))
* **types:** type `SelectiveSkipBuildType` is deprecated in favor of `SelectiveSkipKey` ([00496de](https://github.com/manferlo81/bundlib/commit/00496deccec34429f2311ad41bf4c0fdbeb50acb))

## [0.20.0](https://github.com/manferlo81/bundlib/compare/v0.19.0...v0.20.0) (2024-08-07)

### ⚠ BREAKING CHANGES

* **type:** Remove old type `BundlibRollupBrowseOutputOptionsWithName`
* **types:** type RollupEsModuleOption renamed to RollupEsModule, RollupInteropOption renamed to RollupInterop
* Removed wrongly spelled function `analizePkg`, use `analyzePkg`... it's been there since v0.17.4 (18/Oct/2020)
* deprecated `module` option has been removed
* deprecated types DeprecatedBundlibOptions, DeprecatedModuleOption & DeprecatedESModuleBuildOptions has been removed
* deprecated `browser` option has been removed
* deprecated types DeprecatedBrowserOption & DeprecatedBrowserBuildOptions has been removed
* deprecated `main` option has been removed
* deprecated types DeprecatedCommonJSBuildOptions & DeprecatedMainOption has been removed
* deprecated `bin` option has been removed
* deprecated type `DeprecatedBinaryOption` has been removed
* **types:** type SelectiveOption renamed to SelectiveBoolBasedOption
* **types:** type SelectiveBooleanOption has been removed in favor of SelectiveSourcemapOption, SelectiveEsModuleOption, SelectiveInteropOption, SelectiveMinOption & SelectiveSkipOption
* **types:** unused types WithSourcemapOption, WithModuleOptions, WithMinOption, InputOptions, ModuleString, ModuleOption, MinOption & BrowserOptions have been removed
* **types:** deprecated types ObjectSelectiveOptions, StringBasedSelectiveOption, SelectiveType, ObjectSelectiveOptionsKey, ObjectBasedSelectiveOption, DeprecatedTypesOptions & DeprecatedTypesOption have been removed
* deprecated `types` option has been removed

### Features

* **api:** Detect installed modules during `analyze` phase ([686218e](https://github.com/manferlo81/bundlib/commit/686218e0251997c697f83c82a8b881e67427314d))
* Better detected module info ([2f5c87d](https://github.com/manferlo81/bundlib/commit/2f5c87d6baa811dccd4f5beeb06db529ddbfb00e))
* **cli:** Show information about detected modules and plugins ([2a59887](https://github.com/manferlo81/bundlib/commit/2a59887617712486b8e29a39258b489d9d1d118d))
* Export `bundlib` function ([7fb4b65](https://github.com/manferlo81/bundlib/commit/7fb4b653f3af0de72d378ed6607cf1b8463a065d))
* Export pkgToConfigs function ([bc1d4ae](https://github.com/manferlo81/bundlib/commit/bc1d4ae71af2b2603d94110638176e496fe5bc44))
* Positive and Negative selective option ([f541d34](https://github.com/manferlo81/bundlib/commit/f541d34be4db36adcac26568d7909340bde552ac))
* Show Error on not supported versions on NodeJS ([839ad6c](https://github.com/manferlo81/bundlib/commit/839ad6c7545907eea42fa93ee379848c709ca938))
* Use rollup esModule & interop options at full potential ([f05bff6](https://github.com/manferlo81/bundlib/commit/f05bff6da4ced9b3f35ce72c8095c210622842f4))

* Remove deprecated `browser` option ([8a39704](https://github.com/manferlo81/bundlib/commit/8a397040603e053acd5385307a614f41eaf915cc))
* Remove deprecated `main` option ([7c466d3](https://github.com/manferlo81/bundlib/commit/7c466d3da20507e8fcf991ef55079597f27ddad2))
* Remove deprecated `module` option ([b204525](https://github.com/manferlo81/bundlib/commit/b204525be07782242ef0c46a8e584cdf22a50c11))
* Remove deprecated bin option ([599a9e7](https://github.com/manferlo81/bundlib/commit/599a9e7e603cc37bbc85374ac6c7a47b44e23bd7))
* Remove deprecated types ([41256ba](https://github.com/manferlo81/bundlib/commit/41256ba8fa59170ddc4274d9866c957c3d778abd))
* Remove deprecated types option ([15696d1](https://github.com/manferlo81/bundlib/commit/15696d133a10bebe5b0ce1353c294de998484962))
* Remove wrongly spelled function ([a3d2038](https://github.com/manferlo81/bundlib/commit/a3d20380ef553978c4fe722181a53a628f97b1de))
* **type:** Remove old type `BundlibRollupBrowseOutputOptionsWithName` ([1aca070](https://github.com/manferlo81/bundlib/commit/1aca070cf9739f447013718561461c558eabd392))
* **types:** Remove deprecated types ([b50524c](https://github.com/manferlo81/bundlib/commit/b50524c3ebfed4b9ddc3b05b6b59fd95c81b0d3c))
* **types:** Remove deprecated types ([3c7c7c7](https://github.com/manferlo81/bundlib/commit/3c7c7c7c021386219599084b237caa309f1de10a))
* **types:** Rename some types ([556ef22](https://github.com/manferlo81/bundlib/commit/556ef22ea26bbd11422d546096527fe501086645))

## [0.19.0](https://github.com/manferlo81/bundlib/compare/v0.18.4...v0.19.0) (2024-07-21)

### ⚠ BREAKING CHANGES

* analyzePkg no longer throws on invalid

### Features

* Add new search places for config files ([3c5fb7e](https://github.com/manferlo81/bundlib/commit/3c5fb7ea9f1b5ad90ff9b24617ef88da59d8c0b9))
* Expose readPkg function ([f53e80d](https://github.com/manferlo81/bundlib/commit/f53e80d01b101adcdf8efcef8d2e1086edb2ec44))
* Use typescript only if it's installed ([1764ed9](https://github.com/manferlo81/bundlib/commit/1764ed9fe73e62fde7944aebd8031a2d16e1e873))

### Bug Fixes

* **deps:** Fixed vulnerabilities ([b26e999](https://github.com/manferlo81/bundlib/commit/b26e9992f05f03e1a9af9a65e885fa44e0778bbf))
* Export missing types ([5f09706](https://github.com/manferlo81/bundlib/commit/5f09706db81ac28b410fe600cdf8018fbd936dbc))

### [0.18.4](https://github.com/manferlo81/bundlib/compare/v0.18.3...v0.18.4) (2020-12-03)

### Bug Fixes

* Built console message path color ([311329b](https://github.com/manferlo81/bundlib/commit/311329b42f197e29686c298837cb7857799321d8))

### [0.18.3](https://github.com/manferlo81/bundlib/compare/v0.18.2...v0.18.3) (2020-11-18)

### [0.18.2](https://github.com/manferlo81/bundlib/compare/v0.18.1...v0.18.2) (2020-11-10)

### Bug Fixes

* Throw on array option if not supported ([9d2bde6](https://github.com/manferlo81/bundlib/commit/9d2bde6804eb646615b4a3eeb4ed28076c876433))

### [0.18.1](https://github.com/manferlo81/bundlib/compare/v0.18.0...v0.18.1) (2020-10-29)

## [0.18.0](https://github.com/manferlo81/bundlib/compare/v0.17.8...v0.18.0) (2020-10-28)

### Features

* CommonJS chunks ([59f7927](https://github.com/manferlo81/bundlib/commit/59f7927972952142800952f91a0f325b4cf5a819))

### [0.17.8](https://github.com/manferlo81/bundlib/compare/v0.17.7...v0.17.8) (2020-10-28)

### Bug Fixes

* Fix bug when building Binary and require file ([23aaa3e](https://github.com/manferlo81/bundlib/commit/23aaa3e1be6bc113bb5b1dd3ae2b9cdc626a6ab5))
* Point the CLI to the actual CommonJS API file ([6deeed5](https://github.com/manferlo81/bundlib/commit/6deeed534269f52349e79f40ac3f2768b3b4ab71))

### [0.17.7](https://github.com/manferlo81/bundlib/compare/v0.17.5...v0.17.7) (2020-10-21)

### [0.17.6](https://github.com/manferlo81/bundlib/compare/v0.17.5...v0.17.6) (2020-10-21)

### Bug Fixes

* Prevent declartionMap option warning ([e58073a](https://github.com/manferlo81/bundlib/commit/e58073ac568938672446f4481eae707fb5ec9b7a))

### [0.17.5](https://github.com/manferlo81/bundlib/compare/v0.17.4...v0.17.5) (2020-10-18)

### [0.17.4](https://github.com/manferlo81/bundlib/compare/v0.17.3...v0.17.4) (2020-10-18)

### Bug Fixes

* Typo on API exported function name ([d639dc6](https://github.com/manferlo81/bundlib/commit/d639dc68f4bd70967c2cc8c016771b10767abef0))

### [0.17.3](https://github.com/manferlo81/bundlib/compare/v0.17.2...v0.17.3) (2020-10-10)

### [0.17.2](https://github.com/manferlo81/bundlib/compare/v0.17.1...v0.17.2) (2020-08-04)

### Bug Fixes

* Explicitly set rollup exports option ([63e62ef](https://github.com/manferlo81/bundlib/commit/63e62ef1cdfa544ce31b22c8d23cf34d1413981e))

### [0.17.1](https://github.com/manferlo81/bundlib/compare/v0.17.0...v0.17.1) (2020-08-02)

### Bug Fixes

* Crash if peer deps not installed ([d19fd46](https://github.com/manferlo81/bundlib/commit/d19fd46bba532eb1d3ed8e8f9402ffce6c8fea38))

## [0.17.0](https://github.com/manferlo81/bundlib/compare/v0.16.4...v0.17.0) (2020-07-15)

### ⚠ BREAKING CHANGES

* Option equals has to be explicitly set
* PkgAnalized changed

* Option "equals" ([b66ce5c](https://github.com/manferlo81/bundlib/commit/b66ce5c366e0ebcb563a4002b46661fb3c91df86))

### [0.16.4](https://github.com/manferlo81/bundlib/compare/v0.16.3...v0.16.4) (2020-05-30)

### Bug Fixes

* rollup-plugin-terser sourcemap option ([256cd7b](https://github.com/manferlo81/bundlib/commit/256cd7b62a72e7fcbc773d541a429978e872cad9))

### [0.16.3](https://github.com/manferlo81/bundlib/compare/v0.16.2...v0.16.3) (2020-04-30)

### Bug Fixes

* Fix babel plugin issue ([8d92eb4](https://github.com/manferlo81/bundlib/commit/8d92eb46cae1ba6f436b011b0525d9b40a716da6))

### [0.16.2](https://github.com/manferlo81/bundlib/compare/v0.16.1...v0.16.2) (2020-04-29)

### [0.16.1](https://github.com/manferlo81/bundlib/compare/v0.16.0...v0.16.1) (2020-04-28)

### Features

* Support @rollup/plugin-babel ([444a676](https://github.com/manferlo81/bundlib/commit/444a67609539a009f8a5be73845d899092def62a))

## [0.16.0](https://github.com/manferlo81/bundlib/compare/v0.15.5...v0.16.0) (2020-04-18)

### ⚠ BREAKING CHANGES

* `configFromPkg` resolves to CommonJS configs first
* analyzePkg result new format

### Features

* "bundlib" filed as a string in package.json ([aa05c90](https://github.com/manferlo81/bundlib/commit/aa05c90a0c7153065895889cf3502d839b851fa7))
* Implemented improved options load ([a9bf7f7](https://github.com/manferlo81/bundlib/commit/a9bf7f705aacc745b444637caaced07eeb479d06))
* Selective options ([a409b2c](https://github.com/manferlo81/bundlib/commit/a409b2cc310e30e759125d8b865ba7774d2cc7c2))
* Skip option ([f4e3bc1](https://github.com/manferlo81/bundlib/commit/f4e3bc1b57ceae8b5ab1bb968068ae19575e4ae9))
* Support "hidden" sourcemap option ([a678d6c](https://github.com/manferlo81/bundlib/commit/a678d6c29799b753ba43f2f4f324404dcd70267b))
* Throw on invalid types path & types from js ([c6db25c](https://github.com/manferlo81/bundlib/commit/c6db25c0ed2d8dbf79c49b7cc4a59122205fe677))

### Bug Fixes

* Shebang issue on minified binary ([d8f1df1](https://github.com/manferlo81/bundlib/commit/d8f1df1087d6cd651ba37c9cd2c794a2ef3b2322))

### [0.15.5](https://github.com/manferlo81/bundlib/compare/v0.15.4...v0.15.5) (2020-03-28)

### Bug Fixes

* exit process on error ([17b4941](https://github.com/manferlo81/bundlib/commit/17b494105ea237699a5aa9f6833028f9c3df3f56))

### [0.15.4](https://github.com/manferlo81/bundlib/compare/v0.15.3...v0.15.4) (2020-03-27)

### Bug Fixes

* issue after updated plugin ([64c19b0](https://github.com/manferlo81/bundlib/commit/64c19b053c42066fa0bbc6294d322994261f0049))

### [0.15.3](https://github.com/manferlo81/bundlib/compare/v0.15.2...v0.15.3) (2020-03-25)

### Features

* Individual cache for every format ([794ae88](https://github.com/manferlo81/bundlib/commit/794ae8863ee2932ab7962657711b6a5917788061))
* support @rollup/plugin-buble ([01c6802](https://github.com/manferlo81/bundlib/commit/01c6802968b0b462467edb11f78ccd90148c13fb))
* support @rollup/plugin-typescript ([8706f33](https://github.com/manferlo81/bundlib/commit/8706f330054d4678a4d5112097c8dc6d3aa4d111))

### [0.15.2](https://github.com/manferlo81/bundlib/compare/v0.15.1...v0.15.2) (2020-03-20)

### [0.15.1](https://github.com/manferlo81/bundlib/compare/v0.15.0...v0.15.1) (2020-03-19)

### Bug Fixes

* exit process on error ([3ea3c7e](https://github.com/manferlo81/bundlib/commit/3ea3c7e246d4c73894764b8bac125cb6b2306cbf))

## [0.15.0](https://github.com/manferlo81/bundlib/compare/v0.14.4...v0.15.0) (2020-03-19)

### ⚠ BREAKING CHANGES

* `rollup` has to be installed separately

### Features

* analyzePkg no longer returns resolved paths ([ad8e8ba](https://github.com/manferlo81/bundlib/commit/ad8e8ba43c8dec13870d449ea083db238034e05b))
* eslint, babel & json as optional plugins ([a4d28be](https://github.com/manferlo81/bundlib/commit/a4d28befb23efc24e0f36f09a0b6bca37ea84ea5))
* find input files ([b551b7d](https://github.com/manferlo81/bundlib/commit/b551b7d2f387e0828bfd74259034e8f4211add5e))
* implemented "project" option ([0bd3b36](https://github.com/manferlo81/bundlib/commit/0bd3b36c8a8d1be55e3790c3b17becd4d2101117))
* load optional plugins using dynamic import ([05057a1](https://github.com/manferlo81/bundlib/commit/05057a10c7c86f602698ac9717e950990af4a51d))
* optional commonjs & node-resolve plugins ([4390e57](https://github.com/manferlo81/bundlib/commit/4390e57bfdfa35b29a4f67b8a5d4a06372b570a3))
* optional plugins ([8095982](https://github.com/manferlo81/bundlib/commit/8095982b2c71c38f1e52329e5b1327307ecd8ef9))
* optional terser plugin ([4c1979f](https://github.com/manferlo81/bundlib/commit/4c1979f6186234fd30098a5baad50e5d4f1cc259))
* optional typescript plugin ([25abf20](https://github.com/manferlo81/bundlib/commit/25abf203075506b9f61008f8a61202599c869eb6))
* rollup as peer dependency ([973edea](https://github.com/manferlo81/bundlib/commit/973edeafc11e37f04291bd25e7f1770494074321))

### Bug Fixes

* resolve esModule path ([a8e695b](https://github.com/manferlo81/bundlib/commit/a8e695ba5d01ee9efb797805b6a37f193cf7bef3))

### [0.14.4](https://github.com/manferlo81/bundlib/compare/v0.14.3...v0.14.4) (2020-03-12)

### Features

* isDepInstalled returns installed version ([44e6b8a](https://github.com/manferlo81/bundlib/commit/44e6b8a36482e8f607a7a9ee0c69b3b583617a7a))

### [0.14.3](https://github.com/manferlo81/bundlib/compare/v0.14.2...v0.14.3) (2020-03-10)

### [0.14.2](https://github.com/manferlo81/bundlib/compare/v0.14.1...v0.14.2) (2020-02-13)

### [0.14.1](https://github.com/manferlo81/bundlib/compare/v0.14.0...v0.14.1) (2020-01-16)

* documented BREAKING CHANGES on README

## [0.14.0](https://github.com/manferlo81/bundlib/compare/v0.13.4...v0.14.0) (2020-01-15)

### ⚠ BREAKING CHANGES

* **analyze:** analyzePkg returns dependencies versions

### Features

* **analyze:** analyzed dependencies versions ([f06b5c0](https://github.com/manferlo81/bundlib/commit/f06b5c0ef6d136ce1141e233bbb0e4c7e6456d79))

### Bug Fixes

* rollup watcher type ([ca4ae2e](https://github.com/manferlo81/bundlib/commit/ca4ae2e00b782b9dcbcecd8362d94168b8481bef))

### [0.13.4](https://github.com/manferlo81/bundlib/compare/v0.13.3...v0.13.4) (2019-11-20)

### Bug Fixes

* throw if error on build ([0a547d0](https://github.com/manferlo81/bundlib/commit/0a547d0fdff612901449118b6c1c44e395ce77fa))

### [0.13.3](https://github.com/manferlo81/bundlib/compare/v0.13.2...v0.13.3) (2019-11-19)

### Features

* implemented eslint plugin ([c93d9e7](https://github.com/manferlo81/bundlib/commit/c93d9e7ca03e93c93258415ea568274fc457f47b))

### [0.13.2](https://github.com/manferlo81/bundlib/compare/v0.13.1...v0.13.2) (2019-11-12)

### Bug Fixes

* show correct name on cli help ([e4a2cd9](https://github.com/manferlo81/bundlib/commit/e4a2cd9dcc40bc5fd1d123b4698352da4ced2847))

### [0.13.1](https://github.com/manferlo81/bundlib/compare/v0.13.0...v0.13.1) (2019-11-06)

### Bug Fixes

* filesize issue [#111](https://github.com/manferlo81/bundlib/issues/111) ([3b1aed5](https://github.com/manferlo81/bundlib/commit/3b1aed5fa2f15c53055ac795001b2547eb3bb769))

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
* `analyzePkg` returns a totally different object

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

* `configsFromPkg` throws on non `*.ts` input instead of `analyzePkg`
* `optionalDependencies` as external
* `jsnext:main` field as `module` field fallback
* analyzed dependencies as null if not present
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

* analyzed package format refactoring

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
