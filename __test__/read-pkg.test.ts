import { join as pathJoin } from 'path';
import analyze from './tools/analyze';
import { mockFS } from './tools/mock-fs';

describe('read package.json', () => {

  const cwd = process.cwd();

  test('should throw on no package.json', () => {
    const promise = mockFS({}, () => analyze(cwd));
    return expect(promise).rejects.toThrow();
  });

  test('should throw on invalid folder', () => {
    const promise = mockFS({}, () => analyze(pathJoin(cwd, 'does-not-exist')));
    return expect(promise).rejects.toThrow();
  });

  test('should throw on invalid package.json', () => {

    const invalidPkg = [
      1,
      'string',
      [],
      true,
    ];

    expect.assertions(invalidPkg.length);

    invalidPkg.forEach((pkg) => {
      void expect(analyze(cwd, pkg as never)).rejects.toThrow(TypeError);
    });

  });

  test('should read and analyze package.json if not provided', async () => {

    const mockPkg = {
      name: 'lib',
    };

    const structure = {
      'package.json': JSON.stringify(mockPkg),
    };

    const { cwd: cwdR, pkg } = await mockFS(structure, () => analyze(cwd));

    expect(cwdR).toBe(cwd);
    expect(typeof pkg).toBe('object');
    expect(pkg).toEqual(mockPkg);

  });

});
