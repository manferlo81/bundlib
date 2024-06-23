import { createIsExternal } from '../src/api/tools/create-is-external';

describe('array-to-external method', () => {

  test('Should always return false is no dependencies', () => {
    const isExternal = createIsExternal(null, undefined);
    expect(isExternal('any-external', undefined, false)).toBe(false);
  });

  test('Should always return false is empty dependencies', () => {
    const isExternal = createIsExternal([]);
    expect(isExternal('any-external', undefined, false)).toBe(false);
  });

  test('Should return false if already resolved', () => {
    const isExternal = createIsExternal(['external']);
    const resolved = true;
    expect(isExternal('external', undefined, resolved)).toBe(false);
  });

  test('Should return false it\'s a local project file', () => {
    const isExternal = createIsExternal(['external']);
    expect(isExternal('./any-module', undefined, false)).toBe(false);
    expect(isExternal('./any-module/file.ext', undefined, false)).toBe(false);
  });

  test('Should detect as external module', () => {
    const isExternal = createIsExternal(['external']);
    expect(isExternal('external', undefined, false)).toBe(true);
    expect(isExternal('not-external', undefined, false)).toBe(false);
  });

  test('Should detect as external from sub path', () => {
    const isExternal = createIsExternal(['external']);
    expect(isExternal('external/file1.ext', undefined, false)).toBe(true);
    expect(isExternal('external/file2.ext', undefined, false)).toBe(true);
    expect(isExternal('not-external/file.ext', undefined, false)).toBe(false);
  });

  test('Should get value from cache', () => {
    const isExternal = createIsExternal(['external1', 'external2']);
    expect(isExternal('external1', undefined, false)).toBe(true);
    expect(isExternal('external1', undefined, false)).toBe(true);
    expect(isExternal('external2/file1.ext', undefined, false)).toBe(true);
    expect(isExternal('external2/file2.ext', undefined, false)).toBe(true);
  });

  test('Should not detect as external', () => {
    const isExternal = createIsExternal(['external1', 'external2'], ['external3']);
    expect(isExternal('external1', undefined, false)).toBe(true);
    expect(isExternal('external2/file.ext', undefined, false)).toBe(true);
    expect(isExternal('not-external', undefined, false)).toBe(false);
    expect(isExternal('not-external/file.ext', undefined, false)).toBe(false);
  });

});
