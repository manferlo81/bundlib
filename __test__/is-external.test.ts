import { createIsExternal } from '../src/api/tools/create-is-external';
import { colorizeMessage } from './tools/colors';

describe(colorizeMessage('createIsExternal function'), () => {

  test(colorizeMessage('Should always return false if no dependencies'), () => {
    const isExternal = createIsExternal(null, undefined);
    expect(isExternal('any-external', undefined, false)).toBe(false);
  });

  test(colorizeMessage('Should always return false if empty dependencies'), () => {
    const isExternal = createIsExternal([]);
    expect(isExternal('any-external', undefined, false)).toBe(false);
  });

  test(colorizeMessage('Should return false if already resolved'), () => {
    const isExternal = createIsExternal(['external']);
    const resolved = true;
    expect(isExternal('external', undefined, resolved)).toBe(false);
  });

  test(colorizeMessage('Should return false if it\'s a local project file'), () => {
    const isExternal = createIsExternal(['external']);
    expect(isExternal('./any-module', undefined, false)).toBe(false);
    expect(isExternal('./any-module/file.ext', undefined, false)).toBe(false);
  });

  test(colorizeMessage('Should detect as external module'), () => {
    const isExternal = createIsExternal(['external']);
    expect(isExternal('external', undefined, false)).toBe(true);
    expect(isExternal('not-external', undefined, false)).toBe(false);
  });

  test(colorizeMessage('Should detect as external from sub path'), () => {
    const isExternal = createIsExternal(['external']);
    expect(isExternal('external/file1.ext', undefined, false)).toBe(true);
    expect(isExternal('external/file2.ext', undefined, false)).toBe(true);
    expect(isExternal('not-external/file.ext', undefined, false)).toBe(false);
  });

  test(colorizeMessage('Should get value from cache'), () => {
    const isExternal = createIsExternal(['external1', 'external2']);
    expect(isExternal('external1', undefined, false)).toBe(true);
    expect(isExternal('external1', undefined, false)).toBe(true);
    expect(isExternal('external2/file1.ext', undefined, false)).toBe(true);
    expect(isExternal('external2/file2.ext', undefined, false)).toBe(true);
  });

  test(colorizeMessage('Should not detect as external'), () => {
    const isExternal = createIsExternal(['external1', 'external2'], ['external3']);
    expect(isExternal('external1', undefined, false)).toBe(true);
    expect(isExternal('external2/file.ext', undefined, false)).toBe(true);
    expect(isExternal('not-external', undefined, false)).toBe(false);
    expect(isExternal('not-external/file.ext', undefined, false)).toBe(false);
  });

});
