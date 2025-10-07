import { colorizeMessage } from '../tools/colors'
import { mockAnalyzeWithPkg, mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs'

describe(colorizeMessage('"name" option'), () => {

  const cwd = process.cwd()

  const analyzeWithNameOption = (name: string) => {
    return mockAnalyzeWithPkg(cwd, {
      name: 'pkg-name',
      browser: 'browser.js',
      bundlib: { input: 'src/index.js', name },
    })
  }

  test(colorizeMessage('Should throw on invalid "name" option'), () => {

    const invalidNameOptions = [
      1,
      true,
      false,
    ]

    invalidNameOptions.forEach((name) => {
      void expect(analyzeWithNameOption(name as never)).rejects.toThrow('Invalid "name" option')
    })

  })

  test(colorizeMessage('Should use "name" option'), async () => {
    const name = 'pkg-name'
    const { browser } = await analyzeWithNameOption(name)
    expect(browser?.name).toBe(name)
  })

  test(colorizeMessage('Should default to camel cased, unscoped package.json "name" field if no "name" option present'), async () => {

    const pkgName = '@scope/pkg-name'

    const { browser } = await mockAnalyzeWithPkgEmptyConfig(cwd, {
      name: pkgName,
      browser: 'browser.umd.js',
    })

    expect(browser?.name).toBe('pkgName')

  })

  test(colorizeMessage('Should default to camel cased directory name no "name" option and no "name" package.json field present'), async () => {

    const { browser } = await mockAnalyzeWithPkgEmptyConfig('c:/projects/project-one', {
      browser: 'browser.umd.js',
    })

    expect(browser?.name).toBe('projectOne')

  })

  test(colorizeMessage('Should set browser name to null if not provided and can\'t be inferred'), async () => {

    const { browser } = await mockAnalyzeWithPkgEmptyConfig('', {
      browser: 'browser.umd.js',
    })

    expect(browser?.name).toBeNull()

  })

})
