import type { DirectoryItems } from 'mock-fs/lib/filesystem'
import { join as pathJoin } from 'path'
import type { BundlibPkgJson } from '../src/api'
import { readPkg } from '../src/api'
import { colorizeMessage } from './tools/colors'
import { mockFS } from './tools/mock-fs'

describe(colorizeMessage('Read package.json'), () => {

  const cwd = process.cwd()

  async function mockReadPkgWithStructure(pkgCWD: string, structure: DirectoryItems = {}): Promise<BundlibPkgJson> {
    return await mockFS(() => readPkg(pkgCWD), structure)
  }

  async function mockReadPkgWithContent(content: unknown): Promise<BundlibPkgJson> {
    const structure = {
      'package.json': JSON.stringify(content),
    }
    return await mockReadPkgWithStructure(cwd, structure)
  }

  test(colorizeMessage('Should throw on no package.json'), () => {
    const promise = mockReadPkgWithStructure(cwd, {})
    return expect(promise).rejects.toThrow()
  })

  test(colorizeMessage('Should throw on invalid folder'), () => {
    const promise = mockReadPkgWithStructure(pathJoin(cwd, 'does-not-exist'), {})
    return expect(promise).rejects.toThrow()
  })

  test(colorizeMessage('Should throw on invalid package.json'), async () => {
    const msg = 'Invalid package.json content'
    await expect(mockReadPkgWithContent(0)).rejects.toThrow(msg)
    await expect(mockReadPkgWithContent(1)).rejects.toThrow(msg)
    await expect(mockReadPkgWithContent('')).rejects.toThrow(msg)
    await expect(mockReadPkgWithContent('string')).rejects.toThrow(msg)
    await expect(mockReadPkgWithContent([])).rejects.toThrow(msg)
    await expect(mockReadPkgWithContent(true)).rejects.toThrow(msg)
    await expect(mockReadPkgWithContent(false)).rejects.toThrow(msg)
  })

  test(colorizeMessage('Should read package.json'), async () => {

    const mockPkg = {
      name: 'lib',
    }

    const pkg = await mockReadPkgWithContent(mockPkg)

    expect(typeof pkg).toBe('object')
    expect(pkg).toEqual(mockPkg)

  })

})
