import mock from 'mock-fs';
import { DirectoryItems } from 'mock-fs/lib/filesystem';

export const mockFS = async <R extends Promise<unknown>>(structure: DirectoryItems, callback: () => R): Promise<R> => {
  mock(structure, { createCwd: false, createTmp: false });
  const result = await callback();
  mock.restore();
  return result;
};
