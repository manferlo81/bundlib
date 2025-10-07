import { rollup } from 'rollup'
import { dependencies, devDependencies } from '../package.json'
import { createConfigs } from './tools/create-configs'
import { buildTypeColor } from './tools/colors'

jest.mock('rollup')

describe('build', () => {

  const cwd = process.cwd()
  const deps = { dependencies, devDependencies }

  test(`Should build a ${buildTypeColor('CommonJS module')}`, async () => {

    const [config] = await createConfigs(cwd, false, {
      main: 'out/lib.cjs.js',
      bundlib: { input: 'src/api/analyze-pkg.ts' },
      ...deps,
    })
    const build = await rollup(config)
    const { output: [{ code }] } = await build.generate(config.output)

    expect(typeof code).toBe('string')

  }, 30000)

  test(`Should build a ${buildTypeColor('Binary')}`, async () => {

    const [config] = await createConfigs(cwd, false, {
      bin: 'out/lib.cjs.js',
      bundlib: {
        input: { bin: 'src/cli/index.ts' },
      },
      ...deps,
    })
    const build = await rollup(config)
    const { output: [{ code }] } = await build.generate(config.output)

    expect(typeof code).toBe('string')

  }, 30000)

  test(`Should build a ${buildTypeColor('Browser module')}`, async () => {

    const [config] = await createConfigs(cwd, false, {
      browser: 'out/lib.umd.js',
      bundlib: { input: 'src/api/helpers.ts', globals: null },
      ...deps,
    })
    const build = await rollup(config)
    const { output: [{ code }] } = await build.generate(config.output)

    expect(typeof code).toBe('string')

  }, 30000)

  test(`Should build a ${buildTypeColor('CommonJS module')} and a ${buildTypeColor('Binary')}`, async () => {

    const [cjsConfig, binConfig] = await createConfigs(cwd, false, {
      main: 'out/lib.cjs.js',
      bin: 'bin/cli.js',
      bundlib: {
        input: { api: 'src/api/index.ts', bin: 'src/cli/index.ts' },
      },
      ...deps,
    })

    const cjsBuild = await rollup(cjsConfig)
    const { output: [{ code: cjsCode }] } = await cjsBuild.generate(cjsConfig.output)
    expect(typeof cjsCode).toBe('string')

    const binBuild = await rollup(binConfig)
    const { output: [{ code: binCode }] } = await binBuild.generate(binConfig.output)
    expect(typeof binCode).toBe('string')

  }, 30000)

})
