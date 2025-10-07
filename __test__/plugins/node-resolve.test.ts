import { buildTypeColor, packageNameColor } from '../tools/colors'
import { mockGetPluginNames } from '../tools/mock-fs'

const pluginPackageName = packageNameColor('@rollup/plugin-node-resolve')

describe(`${pluginPackageName} plugin`, () => {

  const cwd = process.cwd()
  const pluginName = 'node-resolve'

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ]

  outputFields.forEach(({ field, text }) => {
    test(`Should use ${pluginPackageName} on ${buildTypeColor(text)}`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        [field]: 'output.js',
      })
      expect(plugins).toContain(pluginName)
    })
  })

})
