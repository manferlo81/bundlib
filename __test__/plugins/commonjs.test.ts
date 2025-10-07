import { buildTypeColor, packageNameColor } from '../tools/colors'
import { mockGetPluginNames } from '../tools/mock-fs'

const pluginPackageName = packageNameColor('@rollup/plugin-commonjs')

describe(`${pluginPackageName} plugin`, () => {

  const cwd = process.cwd()
  const pluginName = 'commonjs'

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'bin', text: 'Binary build' },
  ]

  test(`Should use ${pluginPackageName} on ${buildTypeColor('Browser build')}`, async () => {
    const names = await mockGetPluginNames(cwd, {
      browser: 'output.js',
    })
    expect(names).toContain(pluginName)
  })

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${pluginPackageName} on ${buildTypeColor(text)}`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        [field]: 'output.js',
      })
      expect(plugins).not.toContain(pluginName)
    })
  })

})
