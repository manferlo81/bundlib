import getPluginNames from '../tools/get-plugin-names'

describe('rollup-plugin-export-equals plugin', () => {

  const pluginName = 'export-equals'
  const deps = { 'rollup-plugin-export-equals': '*' }
  const bundlib = { input: { api: 'src/api/index.ts', bin: 'src/cli/index.ts' } }
  const outputFields: Array<{ field: string; text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    // { field: 'bin', text: 'Binary build' },
  ]
  const dependenciesFields = ['dependencies', 'devDependencies']

  outputFields.forEach(({ field, text }) => {

    test(`Should not use if not installed on ${text}`, async () => {
      const [plugins] = await getPluginNames(process.cwd(), false, {
        bundlib,
        [field]: 'output.js',
        types: 'types.d.ts',
      })
      expect(plugins).not.toContain(pluginName)
    })

    dependenciesFields.forEach((depField) => {
      test(`Should use if installed as "${depField}" on ${text}`, async () => {
        const [plugins] = await getPluginNames(process.cwd(), false, {
          bundlib,
          [field]: 'output.js',
          types: 'types.d.ts',
          [depField]: deps,
        })
        expect(plugins).toContain(pluginName)
      })
    })

  })

  test('Should use only on first build', async () => {
    const [modulePlugins, mainPlugins, browserPlugins] = await getPluginNames(process.cwd(), false, {
      bundlib,
      main: 'output.js',
      module: 'output.js',
      browser: 'output.js',
      types: 'types.d.ts',
      dependencies: deps,
    })
    expect(modulePlugins).toContain(pluginName)
    expect(mainPlugins).not.toContain(pluginName)
    expect(browserPlugins).not.toContain(pluginName)
  })

  dependenciesFields.forEach((depField) => {
    test(`Should not use if installed as "${depField}" on Binary build`, async () => {
      const [plugins] = await getPluginNames(process.cwd(), false, {
        bundlib,
        bin: 'output.js',
        types: 'types.d.ts',
        [depField]: deps,
      })
      expect(plugins).not.toContain(pluginName)
    })
  })

})
