import { colorizeMessage } from './tools/colors'
import { mockAnalyzeWithPkg } from './tools/mock-fs'

describe('analyze', () => {

  const cwd = process.cwd()

  test(colorizeMessage('Should analyze provided package.json'), async () => {

    const pkg = { name: 'lib' }
    const analyzed = await mockAnalyzeWithPkg(cwd, pkg)

    expect(analyzed.pkg).toBe(pkg)

  })

  test(colorizeMessage('Should return analyzed package.json'), async () => {

    const pkg = { name: 'lib' }
    const analyzed = await mockAnalyzeWithPkg(cwd, pkg)

    const {
      main,
      module: moduleBuild,
      browser,
      bin,
      types,
      dependencies,
      cache,
    } = analyzed

    expect(main).toBeNull()
    expect(moduleBuild).toBeNull()
    expect(browser).toBeNull()
    expect(bin).toBeNull()
    expect(types).toBeNull()
    expect(dependencies).toEqual({
      runtime: null,
      dev: null,
      peer: null,
    })
    expect(cache).toBeNull()

  })

})
