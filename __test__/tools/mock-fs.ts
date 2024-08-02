import mock from 'mock-fs';
import { DirectoryItems } from 'mock-fs/lib/filesystem';
import { BundlibPkgJson, analyzePkg } from '../../src/api';
import { getPluginNames } from './get-plugin-names';

type MockFSCallback<R> = () => R | Promise<R>;

export const mockFS2 = async <R>(callback: MockFSCallback<R>, structure: DirectoryItems = {}): Promise<R> => {
  mock(structure, { createCwd: false, createTmp: false });
  try {
    return await callback();
  } finally {
    mock.restore();
  }
};

export const mockAnalyzeWithPkg = (cwd: string, pkg: BundlibPkgJson, structure: DirectoryItems = {}) => {
  return mockFS2(
    () => analyzePkg(cwd, pkg),
    structure,
  );
};

export const mockAnalyzeWithPkgEmptyConfig = (cwd: string, pkg: BundlibPkgJson) => {
  return mockAnalyzeWithPkg(
    cwd,
    { bundlib: {}, ...pkg },
  );
};

export function mockGetPluginNames(cwd: string, pkg: BundlibPkgJson) {
  return mockFS2(() => {
    return getPluginNames(cwd, false, {
      bundlib: { input: 'index.js' },
      ...pkg,
    });
  });
}
