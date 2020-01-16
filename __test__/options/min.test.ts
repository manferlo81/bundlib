import { BuildType } from '../../src/api/bundlib-options'
import analize from '../tools/analize'

describe('min option', () => {

  const cwd = process.cwd()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithMin = (min: any) => analize(cwd, {
    main: 'main.js',
    module: 'module.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { min },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analizeWithBuildMin = (field: BuildType, min: any) => analize(cwd, {
    main: 'main.js',
    module: 'module.js',
    browser: 'browser.js',
    bin: 'bin.js',
    bundlib: { [field]: { min } },
  })

  test('should throw on invalid min option', () => {

    const invalidMinOptions = [
      1,
      'main-',
      'module-',
      'browser-',
      'bin-',
      ['main-'],
      ['main', 'browser-'],
      {},
    ]

    expect.assertions(invalidMinOptions.length)

    invalidMinOptions.forEach((min) => {
      expect(
        analizeWithMin(min),
      ).rejects
        .toThrow(TypeError)
    })

  })

  test('should read string main min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithMin('main')

    expect(main ? main.min : null)
      .toBe(true)
    expect(moduleOut ? moduleOut.min : null)
      .toBe(false)
    expect(browser ? browser.min : null)
      .toBe(false)
    expect(bin ? bin.min : null)
      .toBe(false)

  })

  test('should read string module min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithMin('module')

    expect(main ? main.min : null)
      .toBe(false)
    expect(moduleOut ? moduleOut.min : null)
      .toBe(true)
    expect(browser ? browser.min : null)
      .toBe(false)
    expect(bin ? bin.min : null)
      .toBe(false)

  })

  test('should read string browser min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithMin('browser')

    expect(main ? main.min : null)
      .toBe(false)
    expect(moduleOut ? moduleOut.min : null)
      .toBe(false)
    expect(browser ? browser.min : null)
      .toBe(true)
    expect(bin ? bin.min : null)
      .toBe(false)

  })

  test('should read string bin min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithMin('bin')

    expect(main ? main.min : null)
      .toBe(false)
    expect(moduleOut ? moduleOut.min : null)
      .toBe(false)
    expect(browser ? browser.min : null)
      .toBe(false)
    expect(bin ? bin.min : null)
      .toBe(true)

  })

  test('should read array min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithMin(['module', 'bin'])

    expect(main ? main.min : null)
      .toEqual(false)
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(true)
    expect(browser ? browser.min : null)
      .toEqual(false)
    expect(bin ? bin.min : null)
      .toEqual(true)

  })

  test('should read true as min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithMin(true)

    expect(main ? main.min : null)
      .toEqual(true)
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(true)
    expect(browser ? browser.min : null)
      .toEqual(true)
    expect(bin ? bin.min : null)
      .toEqual(true)

  })

  test('should read false as min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithMin(false)

    expect(main ? main.min : null)
      .toEqual(false)
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(false)
    expect(browser ? browser.min : null)
      .toEqual(false)
    expect(bin ? bin.min : null)
      .toEqual(false)

  })

  test('should read per-build main min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithBuildMin('main', true)

    expect(main ? main.min : null)
      .toEqual(true)
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(false)
    expect(browser ? browser.min : null)
      .toEqual(false)
    expect(bin ? bin.min : null)
      .toEqual(false)

  })

  test('should read per-build module min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithBuildMin('module', true)

    expect(main ? main.min : null)
      .toEqual(false)
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(true)
    expect(browser ? browser.min : null)
      .toEqual(false)
    expect(bin ? bin.min : null)
      .toEqual(false)

  })

  test('should read per-build browser min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithBuildMin('browser', true)

    expect(main ? main.min : null)
      .toEqual(false)
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(false)
    expect(browser ? browser.min : null)
      .toEqual(true)
    expect(bin ? bin.min : null)
      .toEqual(false)

  })

  test('should read per-build bin min option', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analizeWithBuildMin('bin', true)

    expect(main ? main.min : null)
      .toEqual(false)
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(false)
    expect(browser ? browser.min : null)
      .toEqual(false)
    expect(bin ? bin.min : null)
      .toEqual(true)

  })

  test('should read per-build min option over top-level one', async () => {

    const { output: { main, module: moduleOut, browser, bin } } = await analize(cwd, {
      main: 'main.js',
      module: 'main.js',
      browser: 'main.js',
      bin: 'main.js',
      bundlib: {
        min: true,
        main: { min: false },
        module: { min: false },
        browser: { min: false },
        bin: { min: false },
      },
    })

    expect(main ? main.min : null)
      .toEqual(false)
    expect(moduleOut ? moduleOut.min : null)
      .toEqual(false)
    expect(browser ? browser.min : null)
      .toEqual(false)
    expect(bin ? bin.min : null)
      .toEqual(false)

  })

})
