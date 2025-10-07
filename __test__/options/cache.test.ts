import type { AllowNullish } from '../../src/api/types/helper-types'
import { colorizeMessage } from '../tools/colors'
import { mockAnalyzeWithPkg, mockAnalyzeWithPkgEmptyConfig } from '../tools/mock-fs'

describe(colorizeMessage('"cache" option'), () => {

  const cwd = process.cwd()

  const analyzeWithCacheOption = (cache: AllowNullish<string>) => mockAnalyzeWithPkg(cwd, {
    bundlib: { cache },
  })

  test(colorizeMessage('Should throw on invalid "cache" option'), () => {

    const invalidCacheOptions = [
      1,
      ['string'],
      {},
      true,
    ]

    invalidCacheOptions.forEach((cache) => {
      void expect(analyzeWithCacheOption(cache as never)).rejects.toThrow('Invalid "cache" option')
    })

  })

  test(colorizeMessage('Should read "cache" option'), async () => {

    const cacheDir = 'cache-folder'
    const { cache } = await analyzeWithCacheOption(cacheDir)

    expect(cache).toBe(cacheDir)

  })

  test(colorizeMessage('Should be null if "cache" option not present'), async () => {

    const { cache } = await mockAnalyzeWithPkgEmptyConfig(cwd, {})

    expect(cache).toBeNull()

  })

})
