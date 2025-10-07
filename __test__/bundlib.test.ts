import { bundlib } from '../src/api'
import { javascriptValueColor } from './tools/colors'
import { spyOnAnalyzePkg, spyOnPkgToConfigs, spyOnReadPkg } from './tools/mock'

describe(`${javascriptValueColor('bundlib')} function`, () => {

  test(`Should export ${javascriptValueColor('bundlib')} function`, () => {
    expect(bundlib).toBeInstanceOf(Function)
  })

  const cwd = process.cwd()

  test(`Should call ${javascriptValueColor('readPkg')}`, () => {
    return spyOnReadPkg(async (mock) => {
      mock.mockImplementation(() => Promise.resolve({ bundlib: {} }))
      await bundlib(cwd)
      expect(mock).toHaveBeenCalledTimes(1)
      expect(mock).toHaveBeenCalledWith(cwd)
    })
  })

  test(`Should call ${javascriptValueColor('analyzePkg')}`, () => {
    return spyOnReadPkg(async (readPkgMock) => {
      const pkgJsonContent = { bundlib: {} }
      readPkgMock.mockImplementation(() => Promise.resolve(pkgJsonContent))
      return spyOnAnalyzePkg(async (mock) => {
        await bundlib(cwd)
        expect(mock).toHaveBeenCalledTimes(1)
        expect(mock).toHaveBeenCalledWith(cwd, pkgJsonContent)
      })
    })
  })

  test(`Should call ${javascriptValueColor('pkgToConfigs')}`, () => {
    return spyOnReadPkg(async (readPkgMock) => {
      readPkgMock.mockImplementation(() => Promise.resolve({ bundlib: {} }))
      return spyOnPkgToConfigs(async (mock) => {
        await bundlib(cwd)
        expect(mock).toHaveBeenCalledTimes(1)
        expect(mock).toHaveBeenCalledWith(expect.any(Object), undefined)
      })
    })
  })

  test(`Should pass given ${javascriptValueColor('options')} to ${javascriptValueColor('pkgToConfigs')}`, () => {
    return spyOnReadPkg(async (readPkgMock) => {
      readPkgMock.mockImplementation(() => Promise.resolve({ bundlib: {} }))
      return spyOnPkgToConfigs(async (mock) => {
        const options = { dev: true, watch: false }
        await bundlib(cwd, options)
        expect(mock).toHaveBeenCalledTimes(1)
        expect(mock).toHaveBeenCalledWith(expect.any(Object), options)
      })
    })
  })

})
