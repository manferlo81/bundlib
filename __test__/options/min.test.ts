import type { BundlibConfig } from '../../src/api'
import { colorizeMessage } from '../tools/colors'
import { mockAnalyzeWithPkg } from '../tools/mock-fs'

describe(colorizeMessage('"min" option'), () => {

  const cwd = process.cwd()

  const analyzeWithMin = (min: BundlibConfig['min']) => mockAnalyzeWithPkg(cwd, {
    main: 'main.js',
    module: 'module.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { input: 'src/index,js', min },
  })

  test(colorizeMessage('Should throw on invalid "min" option'), () => {

    const invalidMinOptions = [
      1,
      'main-',
      'module-',
      'browser-',
      'bin-',
      ['main-'],
      ['main', 'browser-'],
    ]

    invalidMinOptions.forEach((min) => {
      void expect(analyzeWithMin(min as never)).rejects.toThrow('Invalid "min" option')
    })

  })

})
