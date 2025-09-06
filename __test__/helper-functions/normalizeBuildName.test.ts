import { normalizeBuildName } from '../../src/api/options/name';

describe('normalizeBuildName function', () => {

  test('Should use name option if provided', () => {
    expect(normalizeBuildName('name', 'pkg-name', 'c:/directory/project')).toBe('name');
  });

  test('Should use unscoped camelcase version of package name no name option provided', () => {
    const cases = [
      ['pkg', 'pkg'],
      ['pkg-name', 'pkgName'],
      ['@scope/pkg', 'pkg'],
      ['@scope/my-pkg-name', 'myPkgName'],
    ];
    cases.forEach(([pkg, expected]) => {
      expect(normalizeBuildName(null, pkg, 'c:/directory/project')).toBe(expected);
    });
  });

  test('Should use camelcase version of directory name if package name is invalid', () => {
    const cases = [
      ['', 'c:/directory/project', 'project'],
      ['', '/directory/project', 'project'],
      ['@scope/ ', 'c:/directory/project', 'project'],
      ['@scope/ ', '/directory/project', 'project'],
    ];
    cases.forEach(([pkg, cwd, expected]) => {
      expect(normalizeBuildName(null, pkg, cwd)).toBe(expected);
    });
  });

  test('Should use camelcase version of directory name if no name provided', () => {
    const cases = [
      ['c:/directory/project', 'project'],
      ['/directory/project', 'project'],
      ['c:/directory/my-project', 'myProject'],
      ['/directory/my-project', 'myProject'],
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
      'c:/',
      'c:/ ',
    ];
    cases.forEach((invalidCWD) => {
      expect(normalizeBuildName(null, null, invalidCWD)).toBeNull();
    });
  });

});
