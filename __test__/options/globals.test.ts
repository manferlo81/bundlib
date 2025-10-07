import { colorizeMessage } from '../tools/colors'
import { mockAnalyzeWithPkg } from '../tools/mock-fs'

describe(colorizeMessage('"globals" option'), () => {

  const cwd = process.cwd()

  const analyzeWithGlobalsOption = (globals: Record<string, string> | string[] | null) => mockAnalyzeWithPkg(cwd, {
    browser: 'browser.js',
    bundlib: { globals },
  })

  test(colorizeMessage('Should throw on invalid "globals" option'), () => {

    const invalidGlobalsOptions = [
      1,
      true,
      false,
    ]

    invalidGlobalsOptions.forEach((globals) => {
      void expect(analyzeWithGlobalsOption(globals as never)).rejects.toThrow('Invalid "globals" option')
    })

  })

  test(colorizeMessage('Should work with array as "globals" option'), async () => {

    const { browser } = await analyzeWithGlobalsOption(['module1', 'module2'])

    expect(browser?.globals).toEqual({
      module1: 'module1',
      module2: 'module2',
    })

  })

  test(colorizeMessage('Should work with object as "globals" option'), async () => {

    const globals = {
      module1: 'mod1',
      module2: 'mod2',
    }

    const { browser } = await analyzeWithGlobalsOption(globals)

    expect(browser).not.toBeNull()
    expect(browser?.globals).toEqual(globals)

  })

  test(colorizeMessage('Should set globals to null if "globals" option is null'), async () => {

    const { browser } = await analyzeWithGlobalsOption(null)

    expect(browser).not.toBeNull()
    expect(browser?.globals).toBeNull()

  })

  test(colorizeMessage('Should set globals to null if no "globals" option present'), async () => {

    const { browser } = await mockAnalyzeWithPkg(cwd, {
      browser: 'browser.js',
      bundlib: {},
    })

    expect(browser).not.toBeNull()
    expect(browser?.globals).toBeNull()

  })

})
