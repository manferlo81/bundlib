import mock, { restore as restoreMock } from 'mock-fs'
import type { DirectoryItems } from 'mock-fs/lib/filesystem'
import type { BundlibPkgJson } from '../../src/api'
import { analyzePkg } from '../../src/api'
// eslint-disable-next-line import/no-cycle
import { getPluginNames } from './get-plugin-names'

type MockFSCallback<R> = () => R | Promise<R>

export const mockFS = async <R>(callback: MockFSCallback<R>, structure: DirectoryItems = {}): Promise<R> => {
  mock(structure, { createCwd: false, createTmp: false })
  try {
    return await callback()
  } finally {
    restoreMock()
  }
}

export const mockAnalyzeWithPkg = (cwd: string, pkg: BundlibPkgJson, structure: DirectoryItems = {}) => {
  return mockFS(
    () => analyzePkg(cwd, pkg),
    structure,
  )
}

export const mockAnalyzeWithPkgEmptyConfig = (cwd: string, pkg: BundlibPkgJson) => {
  return mockAnalyzeWithPkg(
    cwd,
    { bundlib: {}, ...pkg },
  )
}

export function mockGetPluginNames(cwd: string, pkg: BundlibPkgJson) {
  return mockFS(() => {
    return getPluginNames(cwd, false, {
      bundlib: { input: 'index.js' },
      ...pkg,
    })
  })
}
