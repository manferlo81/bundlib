import mock from 'mock-fs';
import { DirectoryItems } from 'mock-fs/lib/filesystem';

export const mockFS = async <R extends Promise<unknown>>(structure: DirectoryItems, callback: () => R): Promise<R> => {
  mock(structure, { createCwd: false, createTmp: false });
  try {
    const result = await callback();
    return result;
  } finally {
    mock.restore();
  }
};
