import type { BuildType, BundlibConfig, PkgAnalyzed } from '../../src/api'
import { colorizeMessage } from '../tools/colors'
import { mockAnalyzeWithPkg } from '../tools/mock-fs'

describe(colorizeMessage('"interop" option'), () => {

  const cwd = process.cwd()

  const createResult = (analyzed: PkgAnalyzed) => {
    const { main, browser, bin } = analyzed
    return {
      main: main?.interop,
      browser: browser?.interop,
      bin: bin?.interop,
    }
  }

  const analyzeWithInterop = async (interop: BundlibConfig['interop']) => {
    return createResult(
      await mockAnalyzeWithPkg(cwd, {
        main: 'main.js',
        browser: 'browser.js',
        bin: 'binary.js',
        bundlib: { interop },
      }),
    )
  }

  test(colorizeMessage('Should throw on invalid "interop" option'), () => {

    const invalid = [
      1,
      'main-',
      'browser-',
      'bin-',
      ['main-'],
      ['main', 'browser-'],
    ]

    invalid.forEach((interop) => {
      void expect(analyzeWithInterop(interop as never)).rejects.toThrow('Invalid "interop" option')
    })

  })

  test(colorizeMessage('Should read string as "interop" option'), () => {

    const values = ['main', 'browser', 'bin'] as const

    values.forEach((value) => {
      void expect(analyzeWithInterop(value)).resolves.toEqual({
        main: 'main' === value,
        browser: 'browser' === value,
        bin: 'bin' === value,
      })
    })

  })

  test(colorizeMessage('Should read array as "interop" option'), () => {
    const values: BuildType[][] = [
      ['main'],
      ['browser'],
      ['bin'],
      ['main', 'bin'],
      ['main', 'browser'],
    ]
    values.forEach((value) => {
      void expect(analyzeWithInterop(value)).resolves.toEqual({
        main: value.includes('main'),
        browser: value.includes('browser'),
        bin: value.includes('bin'),
      })
    })
  })

  test(colorizeMessage('Should read boolean as "interop" option'), () => {
    [true, false].forEach((value) => {
      void expect(analyzeWithInterop(value)).resolves.toEqual({
        main: value,
        browser: value,
        bin: value,
      })
    })
  })

  test(colorizeMessage('Should read interop string as "interop" option'), () => {
    const interopStrings = [
      'auto',
      'compat',
      'esModule',
      'default',
      'defaultOnly',
    ] as const
    interopStrings.forEach((value) => {
      void expect(analyzeWithInterop(value)).resolves.toEqual({
        main: value,
        browser: value,
        bin: value,
      })
    })
  })

  test(colorizeMessage('Should default to false if "interop" option not present'), async () => {

    const result = createResult(
      await mockAnalyzeWithPkg(cwd, {
        main: 'out/lib.cjs.js',
        browser: 'out/lib.umd.js',
        bin: 'out/lib.bin.js',
      }),
    )

    expect(result).toEqual({
      main: false,
      browser: false,
      bin: false,
    })

  })

})
