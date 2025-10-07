import { buildTypeColor, colorizeMessage } from '../tools/colors'
import { mockGetPluginNames } from '../tools/mock-fs'

const pluginPackageName = 'rollup-plugin-strip-shebang'

describe(colorizeMessage(`${pluginPackageName} plugin`), () => {

  const cwd = process.cwd()
  const pluginName = 'strip-shebang'

  const outputFields = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
  ]

  outputFields.forEach(({ field, text }) => {
    test(colorizeMessage(`Should not use ${pluginPackageName} on ${buildTypeColor(text)}`), () => {
      return expect(mockGetPluginNames(cwd, { [field]: 'output.js' })).resolves.not.toContain(pluginName)
    })
  })

  test(colorizeMessage(`Should use ${pluginPackageName} on ${buildTypeColor('Binary build')}`), () => {
    return expect(mockGetPluginNames(cwd, { bin: 'output.js' })).resolves.toContain(pluginName)
  })

})
