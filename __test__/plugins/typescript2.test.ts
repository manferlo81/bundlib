import { buildTypeColor, packageFieldColor, packageNameColor } from '../tools/colors'
import { mockGetPluginNames } from '../tools/mock-fs'

const typescriptPackageDepName = 'typescript'

const pluginPackageName = packageNameColor('rollup-plugin-typescript2')
const typescriptPackageName = packageNameColor(typescriptPackageDepName)

describe(`${pluginPackageName} plugin`, () => {

  const cwd = process.cwd()

  const pluginName = 'rpt2'
  const deps = { [typescriptPackageDepName]: '*' }

  const outputFields: Array<{ field: string, text: string }> = [
    { field: 'main', text: 'CommonJS Module' },
    { field: 'module', text: 'ES Module' },
    { field: 'browser', text: 'Browser build' },
    { field: 'bin', text: 'Binary build' },
  ]

  const dependenciesFields = ['dependencies', 'devDependencies']

  const bundlib = { input: { api: 'src/api/index.ts', bin: 'src/cli/index.ts' } }

  outputFields.forEach(({ field, text }) => {
    test(`Should not use ${pluginPackageName} on ${buildTypeColor(text)} if input is javascript file`, async () => {
      const plugins = await mockGetPluginNames(cwd, {
        bundlib: { input: { api: 'src/api/index.js', bin: 'src/cli/index.js' } },
        [field]: 'output.js',
      })
      expect(plugins).not.toContain(pluginName)
    })
  })

  dependenciesFields.forEach((depField) => {
    outputFields.forEach(({ field, text }) => {
      test(`Should not use ${pluginPackageName} on ${buildTypeColor(text)} if ${typescriptPackageName} installed as ${packageFieldColor(`"${depField}"`)} and input is javascript file`, async () => {
        const plugins = await mockGetPluginNames(cwd, {
          bundlib: { input: { api: 'src/api/index.js', bin: 'src/cli/index.js' } },
          [field]: 'output.js',
          [depField]: deps,
        })
        expect(plugins).not.toContain(pluginName)
      })
    })

    outputFields.forEach(({ field, text }) => {
      test(`Should use ${pluginPackageName} on ${buildTypeColor(text)} if ${typescriptPackageName} installed as ${packageFieldColor(`"${depField}"`)}`, async () => {
        const plugins = await mockGetPluginNames(cwd, {
          bundlib,
          [field]: 'output.js',
          [depField]: deps,
        })
        expect(plugins).toContain(pluginName)
      })
    })

  })

})
