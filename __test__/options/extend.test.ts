import analize from '../tools/analize'

describe('extend option', () => {

  const cwd = process.cwd()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithExtend = (extend: any) => analize(cwd, {
    browser: 'out/lib.js',
    bundlib: { extend },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithBuildExtend = (extend: any) => analize(cwd, {
    browser: 'out/lib.js',
    bundlib: { extend: !extend, browser: { extend } },
  })

  test('should read truthy extend option as set as boolean', async () => {

    const { output: { browser } } = await analizeWithExtend(1)

    expect(browser ? browser.extend : null)
      .toBe(true)

  })

  test('should read falsy extend option as set as boolean', async () => {

    const { output: { browser } } = await analizeWithExtend(0)

    expect(browser ? browser.extend : null)
      .toBe(false)

  })

  test('should read true extend option as set as boolean', async () => {

    const { output: { browser } } = await analizeWithExtend(true)

    expect(browser ? browser.extend : null)
      .toBe(true)

  })

  test('should read false extend option as set as boolean', async () => {

    const { output: { browser } } = await analizeWithExtend(false)

    expect(browser ? browser.extend : null)
      .toBe(false)

  })

  test('should read truthy per-build extend option as set as boolean', async () => {

    const { output: { browser } } = await analizeWithBuildExtend(1)

    expect(browser ? browser.extend : null)
      .toBe(true)

  })

  test('should read falsy per-build extend option as set as boolean', async () => {

    const { output: { browser } } = await analizeWithBuildExtend(0)

    expect(browser ? browser.extend : null)
      .toBe(false)

  })

  test('should read true per-build extend option as set as boolean', async () => {

    const { output: { browser } } = await analizeWithBuildExtend(true)

    expect(browser ? browser.extend : null)
      .toBe(true)

  })

  test('should read false per-build extend option as set as boolean', async () => {

    const { output: { browser } } = await analizeWithBuildExtend(false)

    expect(browser ? browser.extend : null)
      .toBe(false)

  })

  test('should read per-build extend option over top-level one', async () => {

    const { output: { browser } } = await analize(cwd, {
      browser: 'browser',
      bundlib: { extend: true, browser: { extend: false } },
    })

    expect(browser ? browser.extend : null)
      .toBe(false)

  })

})
