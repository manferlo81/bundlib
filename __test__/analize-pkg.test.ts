import analize from './tools/analize'

describe('analize', () => {

  const cwd = process.cwd()

  test('should analize provided package.json', async () => {

    const pkg = { name: 'lib' }
    const analized = await analize(cwd, pkg)

    expect(analized.pkg)
      .toBe(pkg)

  })

  test('should return analized package.json', async () => {

    const pkg = { name: 'lib' }

    const analized = await analize(cwd, pkg)
    const {
      input,
      output,
      dependencies,
      cache,
    } = analized

    expect(input)
      .toEqual({
        api: null,
        bin: null,
      })
    expect(output)
      .toEqual({
        main: null,
        module: null,
        browser: null,
        bin: null,
        types: null,
      })
    expect(dependencies)
      .toEqual({
        runtime: null,
        dev: null,
        peer: null,
      })
    expect(cache)
      .toBeNull()

  })

})
