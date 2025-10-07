import { colorizeMessage } from '../tools/colors'
import { mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs'

describe(colorizeMessage('package.json "browser" field'), () => {

  const cwd = process.cwd()

  const mockAnalyzeWithBrowserField = (browser: string) => {
    return mockAnalyzeWithPkgEmptyConfig(cwd, { browser })
  }

  test(colorizeMessage('Should throw on invalid "browser" field'), () => {

    const invalidBrowserPaths = [
      1,
      { name: 'value' },
    ]

    invalidBrowserPaths.forEach((invalid) => {
      void expect(mockAnalyzeWithBrowserField(invalid as never)).rejects.toThrow(TypeError)
    })

  })

  test(colorizeMessage('Should read "browser" field'), async () => {

    const browserField = 'browser.js'
    const analyzed = await mockAnalyzeWithBrowserField(browserField)
    const { browser } = analyzed

    expect(browser).not.toBeNull()
    expect(browser?.output).toBe(browserField)

  })

})
