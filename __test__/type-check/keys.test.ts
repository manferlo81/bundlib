import { keysCheck } from '../../src/api/type-check/keys';
import { colorizeMessage } from '../tools/colors';

describe(colorizeMessage('keysCheck function'), () => {

  const check = (obj: Record<string, unknown>) => keysCheck(obj, (key): key is ('pizza' | 'tea') => {
    return key === 'pizza' || key === 'tea';
  });

  test(colorizeMessage('Should return true if all keys match at least one of the checks'), () => {
    expect(check({})).toBe(true);
    expect(check({ pizza: true })).toBe(true);
    expect(check({ tea: 'green' })).toBe(true);
    expect(check({ pizza: true, tea: 'green' })).toBe(true);
  });

  test(colorizeMessage('Should return false if at least one key does\'t match any check'), () => {
    expect(check({ pizza: true, tea: 'black', coffee: 'espresso' })).toBe(false);
  });

});
