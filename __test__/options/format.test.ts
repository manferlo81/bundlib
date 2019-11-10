import analize from '../tools/analize'

describe('format option', () => {

  const cwd = process.cwd()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithFormat = (format: any) => analize(cwd, {
    browser: 'out/lib.js',
    bundlib: { format },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithBuildFormat = (format: any) => analize(cwd, {
    browser: 'out/lib.js',
    bundlib: { browser: { format } },
  })

  test('should throw on invalid format option', () => {

    const invalidBrowserFormats = [
      1,
      'string',
    ]

    expect.assertions(invalidBrowserFormats.length)

    invalidBrowserFormats.forEach((format) => {
      expect(
        analizeWithFormat(format),
      ).rejects
        .toThrow(TypeError)
    })

  })

  test('should set browser format to iife', async () => {

    const format = 'iife'

    const { output: { browser } } = await analizeWithFormat(format)

    expect(browser ? browser.format : null)
      .toBe(format)

  })

  test('should set browser format to amd', async () => {

    const format = 'amd'

    const { output: { browser } } = await analizeWithFormat(format)

    expect(browser ? browser.format : null)
      .toBe(format)

  })

  test('should set browser format to umd', async () => {

    const format = 'umd'

    const { output: { browser } } = await analizeWithFormat(format)

    expect(browser ? browser.format : null)
      .toBe(format)

  })

  test('should set browser format to iife from build', async () => {

    const format = 'iife'

    const { output: { browser } } = await analizeWithBuildFormat(format)

    expect(browser ? browser.format : null)
      .toBe(format)

  })

  test('should set browser format to amd from build', async () => {

    const format = 'amd'

    const { output: { browser } } = await analizeWithBuildFormat(format)

    expect(browser ? browser.format : null)
      .toBe(format)

  })

  test('should set browser format to umd from build', async () => {

    const format = 'umd'

    const { output: { browser } } = await analizeWithBuildFormat(format)

    expect(browser ? browser.format : null)
      .toBe(format)

  })

  test('should default to umd in no browser format provided', async () => {

    const { output: { browser } } = await analize(cwd, { browser: 'out/lib.js' })

    expect(browser ? browser.format : null).toBe('umd')

  })

  test('should read per-build browser format over top-level one', async () => {

    const { output: { browser } } = await analize(cwd, {
      browser: 'out/lib.js',
      bundlib: {
        format: 'amd',
        browser: { format: 'iife' },
      },
    })

    expect(browser ? browser.format : null).toBe('iife')

  })

})
