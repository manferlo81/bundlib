import mock from 'mock-fs';
import { join as pathJoin } from 'path';
import analyze from './tools/analyze';

describe('read package.json', () => {

  const cwd = process.cwd();

  const mockOptions = { createCwd: false, createTmp: false };

  test('should throw on no package.json', () => {

    mock({}, mockOptions);

    const promise = analyze(cwd);

    mock.restore();

    return expect(promise).rejects
      .toThrow();

  });

  test('should throw on invalid folder', () => {

    mock({}, mockOptions);

    const promise = analyze(pathJoin(cwd, 'does-not-exist'));

    mock.restore();

    return expect(promise).rejects
      .toThrow();

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

    mock({
      'package.json': JSON.stringify(mockPkg),
    });

    const { cwd: cwdR, pkg } = await analyze(cwd);

    expect(cwdR)
      .toBe(cwd);
    expect(typeof pkg)
      .toBe('object');
    expect(pkg)
      .toEqual(mockPkg);

    mock.restore();

  });

});
