import { createIsExternal } from '../src/api/tools/create-is-external';

describe('array-to-external method', () => {

  test('Should always return false is no dependencies', () => {
    const isExternal = createIsExternal(null, undefined);
    expect(isExternal('any-external', undefined, false)).toBe(false);
  });

  const isExternal = createIsExternal(['array-external'], { 'object-external-string': '*' }, { 'object-external-bool': true });

  test('Should return undefined if already resolved', () => {
    const resolved = true;
    expect(isExternal('array-external', undefined, resolved)).toBeUndefined();
  });

  test('Should return undefined if not module', () => {
    expect(isExternal('./any-module', undefined, false)).toBeUndefined();
  });

  test('Should detect as external from array', () => {
    expect(isExternal('array-external', undefined, false)).toBe(true);
  });

  test('Should detect as external from object', () => {
    expect(isExternal('object-external-string', undefined, false)).toBe(true);
    expect(isExternal('object-external-bool', undefined, false)).toBe(true);
  });

  test('Should detect as external from sub path', () => {
    expect(isExternal('array-external/file.ext', undefined, false)).toBe(true);
    expect(isExternal('object-external-string/file.ext', undefined, false)).toBe(true);
    expect(isExternal('object-external-bool/file.ext', undefined, false)).toBe(true);
  });

  test('Should not detect as external', () => {
    expect(isExternal('other-external', undefined, false)).toBe(false);
  });

});
