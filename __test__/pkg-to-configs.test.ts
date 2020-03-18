import createConfigs from './tools/create-configs'

describe('package to configs', () => {

  const cwd = process.cwd()

  test('should throw if name required and not provided', () => {

    return expect(
      createConfigs('', false, {
        browser: 'out/lib.js',
      }),
    ).rejects
      .toThrow()

  })

  test('should throw if generate types on javascript source', () => {

    return expect(
      createConfigs('', false, {
        main: 'lib.js',
        types: 'types',
        bundlib: { input: 'src/index.js' },
      }),
    ).rejects
      .toThrow()

  })

  test('should generate empty array if no pkg content', async () => {

    const configs = await createConfigs(cwd, false, {})

    expect(configs)
      .toHaveLength(0)

  })

  test('should generate ES module config', async () => {

    const configs = await createConfigs(cwd, true, {
      module: 'out/lib.cjs.js',
    })

    expect(configs)
      .toHaveLength(1)

    const [config] = configs

    expect(config.output.format)
      .toBe('es')

  })

  test('should generate CommonJS module config', async () => {

    const configs = await createConfigs(cwd, true, {
      main: 'out/lib.cjs.js',
    })

    expect(configs)
      .toHaveLength(1)

    const [config] = configs

    expect(config.output.format)
      .toBe('cjs')

  })

  test('should generate IIFE build config', async () => {

    const format = 'iife'
    const name = 'libName'

    const configs = await createConfigs(cwd, true, {
      browser: 'out/lib.iife.js',
      bundlib: { format, name, globals: {} },
    })

    expect(configs)
      .toHaveLength(1)

    const [config] = configs
    const { output } = config

    expect(output.format)
      .toBe(format)
    expect(output.name)
      .toBe(name)

  })

  test('should generate AMD build config', async () => {

    const format = 'amd'
    const name = 'libName'
    const id = 'lib-id'

    const configs = await createConfigs(cwd, true, {
      browser: 'out/lib.js',
      bundlib: { format, name, id, globals: {} },
    })

    expect(configs)
      .toHaveLength(1)

    const [config] = configs
    const { output } = config

    expect(output.format)
      .toBe(format)
    expect(output.name)
      .toBe(name)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(output.amd!.id)
      .toBe(id)

  })

  test('should generate UMD build config', async () => {

    const format = 'umd'
    const name = 'libName'
    const id = 'lib-id'

    const configs = await createConfigs(cwd, true, {
      browser: 'out/lib.js',
      bundlib: { format, name, id, globals: {} },
    })

    expect(configs)
      .toHaveLength(1)

    const [config] = configs
    const { output } = config

    expect(output.format)
      .toBe(format)
    expect(output.name)
      .toBe(name)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(output.amd!.id)
      .toBe(id)

  })

  test('should generate UMD build if not format provided', async () => {

    const name = 'libName'

    const configs = await createConfigs(cwd, true, {
      browser: 'out/lib.js',
      bundlib: { name },
    })

    expect(configs)
      .toHaveLength(1)

    const [config] = configs
    const { output } = config

    expect(typeof output)
      .toBe('object')
    expect(output.format)
      .toBe('umd')
    expect(output.name)
      .toBe(name)

  })

  test('should generate Binary build config from default typescript input', async () => {

    const configs = await createConfigs(cwd, true, {
      bin: 'out/lib.js',
    })

    expect(configs)
      .toHaveLength(1)

    const [config] = configs
    const { output } = config

    expect(typeof output)
      .toBe('object')
    expect(output.format)
      .toBe('cjs')

  })

  test('should generate Binary build config from javascript input', async () => {

    const configs = await createConfigs(cwd, true, {
      bin: 'out/lib.js',
      bundlib: { input: { bin: 'src-bin/index.js' } },
    })

    expect(configs)
      .toHaveLength(1)

    const [config] = configs
    const { output } = config

    expect(typeof output)
      .toBe('object')
    expect(output.format)
      .toBe('cjs')

  })

  test('should add exportEquals plugin if conditions apply', async () => {

    const configs = await createConfigs(cwd, true, {
      main: 'out/lib.js',
      types: 'out/lib.d.ts',
      bundlib: {
        input: 'src/index.ts',
        equals: true,
      },
    })

    expect(configs)
      .toHaveLength(1)

    const [config] = configs
    const pluginNames = config.plugins.map((plugin) => plugin.name)

    expect(pluginNames)
      .toContain('export-equals')

  })

  test('should add shebang plugins if conditions apply', async () => {

    const configs = await createConfigs(cwd, true, {
      bin: 'bin/cli.js',
    })

    expect(configs)
      .toHaveLength(1)

    const [config] = configs
    const pluginNames = config.plugins.map((plugin) => plugin.name)

    expect(pluginNames)
      .toContain('strip-shebang')
    expect(pluginNames)
      .toContain('shebang')

  })

  test('should generate configs with extra minified versions from default typescript input', async () => {

    const minifiedPostfix = '.min.js'

    const configs = await createConfigs(cwd, false, {
      main: 'main.js',
      module: 'module.js',
      browser: 'browser.js',
      bin: 'bin.js',
      bundlib: {
        name: 'lib',
        min: true,
      },
    })

    expect(configs)
      .toHaveLength(8)

    configs.forEach((config, index) => {

      const isMin = index % 2

      if (isMin) {

        const { file } = config.output
        expect(file.substr(file.length - minifiedPostfix.length))
          .toBe(minifiedPostfix)

      }

    })

  })

  test('should generate configs with extra minified versions from javascript input', async () => {

    const minifiedPostfix = '.min.js'

    const configs = await createConfigs(cwd, false, {
      main: 'main.js',
      module: 'module.js',
      browser: 'browser.js',
      bin: 'bin.js',
      bundlib: {
        input: { api: 'src/index.js', bin: 'src-bin/index.js' },
        name: 'lib',
        min: true,
      },
    })

    expect(configs)
      .toHaveLength(8)

    configs.forEach((config, index) => {

      const isMin = index % 2

      if (isMin) {

        const { file } = config.output
        expect(file.substr(file.length - minifiedPostfix.length))
          .toBe(minifiedPostfix)

      }

    })

  })

  test('should set dependencies as external', async () => {

    const [config] = await createConfigs(cwd, true, {
      main: 'out/lib.js',
      dependencies: {
        lodash: '*',
      },
    })

    expect(config.external('lodash', '', false))
      .toBe(true)

  })

  test('should set peerDependencies as external', async () => {

    const [config] = await createConfigs(cwd, true, {
      main: 'out/lib.js',
      peerDependencies: {
        lodash: '*',
      },
    })

    expect(config.external('lodash', '', false))
      .toBe(true)

  })

  test('should set builtin modules as external', async () => {

    const [config] = await createConfigs(cwd, true, {
      main: 'out/lib.js',
    })

    expect(config.external('path', '', false))
      .toBe(true)
    expect(config.external('fs', '', false))
      .toBe(true)

  })

  test('should set partial module names as external', async () => {

    const [config] = await createConfigs(cwd, true, {
      main: 'out/lib.js',
      dependencies: {
        lodash: '*',
      },
    })

    expect(config.external('lodash/is-array', '', false))
      .toBe(true)

  })

  test('should set external to none if globals is null', async () => {

    const [config] = await createConfigs(cwd, true, {
      browser: 'out/lib.js',
      bundlib: {
        format: 'amd',
        globals: null,
      },
    })

    expect(config.external.toString())
      .toMatch(/(?:=> false)|(?:return false)/)

  })

  test('should set globals to an object on browser build', async () => {

    const [config] = await createConfigs(cwd, true, {
      browser: 'out/lib.js',
      bundlib: {
        format: 'amd',
        globals: null,
      },
    })

    expect(typeof config.output.globals)
      .toBe('object')

  })

})
