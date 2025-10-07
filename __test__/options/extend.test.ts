import { colorizeMessage } from '../tools/colors'
import { mockAnalyzeWithPkg } from '../tools/mock-fs'

describe(colorizeMessage('"extend" option'), () => {

  const cwd = process.cwd()

  const analyzeWithExtendOption = (extend: boolean | null) => mockAnalyzeWithPkg(cwd, {
    browser: 'browser.js',
    bundlib: { extend },
  })

  test(colorizeMessage('Should allow any truthy value as "extend" option value'), async () => {
    const truthyExtendValues = [
      1,
      Infinity,
      -Infinity,
      'string',
      true,
      [],
      {},
    ]
    for (const truthy of truthyExtendValues) {
      const { browser } = await analyzeWithExtendOption(truthy as never)
      expect(browser?.extend).toBe(true)
    }
  })

  test(colorizeMessage('Should allow any falsy value as "extend" option value'), async () => {
    const falsyExtendValues = [
      0,
      NaN,
      '',
      false,
      null,
      undefined,
    ]
    for (const falsy of falsyExtendValues) {
      const { browser } = await analyzeWithExtendOption(falsy as never)
      expect(browser?.extend).toBe(false)
    }
  })

})
