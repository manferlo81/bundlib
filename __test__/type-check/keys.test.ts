import { keysCheck } from '../../src/api/type-check/keys';

describe('keysCheck function', () => {

  const check = (obj: Record<string, unknown>) => keysCheck(obj, (key): key is ('pizza' | 'tea') => {
    return key === 'pizza' || key === 'tea';
  });

  test('Should return true if all keys match at least one of the checks', () => {
    expect(check({})).toBe(true);
    expect(check({ pizza: true })).toBe(true);
    expect(check({ tea: 'green' })).toBe(true);
    expect(check({ pizza: true, tea: 'green' })).toBe(true);
  });

  test('Should return false if at least one key does\'t match any check', () => {
    expect(check({ pizza: true, tea: 'black', coffee: 'espresso' })).toBe(false);
  });

});
