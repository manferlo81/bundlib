import { join as joinPath } from 'node:path';
import { normalizeBuildName } from '../../src/api/options/name';

describe('normalizeBuildName function', () => {

  test('Should use name option if provided', () => {
    const cwd = joinPath(process.cwd(), 'project');
    expect(normalizeBuildName('name', 'pkg-name', cwd)).toBe('name');
  });

  test('Should use unscoped camelcase version of package name no name option provided', () => {
    const cwd = joinPath(process.cwd(), 'project');
    const cases = [
      ['pkg', 'pkg'],
      ['pkg-name', 'pkgName'],
      ['@scope/pkg', 'pkg'],
      ['@scope/my-pkg-name', 'myPkgName'],
    ];
    cases.forEach(([pkg, expected]) => {
      expect(normalizeBuildName(null, pkg, cwd)).toBe(expected);
    });
  });

  test('Should use camelcase version of directory name if package name is invalid', () => {
    const cwd = joinPath(process.cwd(), 'project');
    const cases = [
      ['', 'project'],
      ['', 'project'],
      ['@scope/ ', 'project'],
      ['@scope/ ', 'project'],
    ];
    cases.forEach(([pkg, expected]) => {
      expect(normalizeBuildName(null, pkg, cwd)).toBe(expected);
    });
  });

  test('Should use camelcase version of directory name if no name provided', () => {
    const cases = [
      [joinPath(process.cwd(), 'project'), 'project'],
      [joinPath(process.cwd(), 'my-project'), 'myProject'],
    ];
    cases.forEach(([cwd, expected]) => {
      expect(normalizeBuildName(null, null, cwd)).toBe(expected);
    });
  });

  test('Should return null if name can\'t be determined', () => {
    const cases = [
      '',
      '/',
      '/ ',
    ];
    cases.forEach((invalidCWD) => {
      expect(normalizeBuildName(null, null, invalidCWD)).toBeNull();
    });
  });

});
